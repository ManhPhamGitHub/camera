import { Cam, CamConfig, StorageEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import {
  CamRepository,
  NotiRepository,
  StorageRepository,
} from '@repositories';
import { PassThrough } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';
import { v2 as Cloudinary } from 'cloudinary';
import { Storage } from '@google-cloud/storage';
import { join } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { decryptStr, encryptStr } from '@utils/authen-helper';
import { env } from '@environments';
import { BaseService } from './base.service';
import nodemailer from 'nodemailer';
const execAsync = promisify(exec);

@Injectable()
export class CamService {
  constructor(
    private CamRepository: CamRepository,
    private storageRepository: StorageRepository,
    private notificationRepository: NotiRepository, // private readonly mailerService: MailerService,
  ) {}
  findOne(option) {
    return this.CamRepository.findOne(option);
  }
  findAll(option) {
    return this.CamRepository.findAll(option);
  }
  insert(cam: Cam) {
    return this.CamRepository.insert(cam);
  }
  update(id: number | string, updateData: any) {
    return this.CamRepository.update(id, updateData);
  }

  updateMulti(option: any, updateData: any) {
    return this.CamRepository.updateMulti(option, updateData);
  }

  handleSendMail = async (config: any, content: any) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.google.email',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: env.get('mail.nodemailerUser'),
        pass: env.get('mail.nodemailerPass'),
      },
    });

    const mailOptions = {
      from: env.get('mail.nodemailerUser'),
      to: config.link,
      subject: 'Camera Service upload file success',
      text: 'Camera Service upload file success',
      html: content,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  };

  async startStreaming(camConfig: CamConfig): Promise<void> {
    const stream = new PassThrough();
    const currentDate = new Date();
    let scaleOption;

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const previousHours = String(currentDate.getHours() - 2).padStart(2, '0');
    const folderPath = join(
      __dirname,
      `../storage/${camConfig.cam.name}/${year}-${month}-${day}/${hours}`,
    );
    const folderPathPreviousHours = join(
      __dirname,
      `../storage/${camConfig.cam.name}/${year}-${month}-${day}/${previousHours}`,
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const formattedDate = `${year}-${month}-${day}_${hours}`;
    const fileNamePreviousHours = `output_${year}-${month}-${day}_${previousHours}.mp4`;
    const playlistName = `output_${formattedDate}.m3u8`;

    const segmentFileName = `segment_${formattedDate}_%03d.ts`;
    const playlistPath = join(folderPath, playlistName);
    const segmentPath = join(folderPath, segmentFileName);
    const outputFilePathPreviousHour = join(folderPath, fileNamePreviousHours);
    switch (camConfig.resolution) {
      case '720p':
        scaleOption = '-vf scale=1280:720';
        break;
      case '1080p':
        scaleOption = '-vf scale=1920:1080';
        break;
      case '1440p':
        scaleOption = '-vf scale=2560:1440';
        break;
      default:
        throw new Error('Unsupported resolution');
    }
    // Create an ffmpeg process to read from the camera URL
    const ffmpegCommand = ffmpeg(camConfig.input)
      .inputOptions(['-rtsp_transport tcp'])
      .outputOptions([
        '-c:v libx264', //  H.264 codec
        scaleOption,
        `-crf ${camConfig.crf}`,
        '-f hls',
        '-hls_time 10', // Set each segment to 10 seconds
        '-hls_list_size 0', // Keep all segments in the playlist
        '-hls_flags delete_segments',
        `-hls_segment_filename ${segmentPath}`,
        '-t 3600', // Set the total duration to 1 hour (3600 seconds)
      ])
      .output(playlistPath)
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        stream.end();
      })
      .on('start', async (commandLine) => {
        console.log('Spawned FFmpeg with command:', commandLine);

        switch (camConfig.provider.providerName) {
          case 'google-cloud':
            await this.uploadToGoogleCloud(
              camConfig,
              folderPathPreviousHours,
              `${camConfig.cam.name}/${year}-${month}-${day}/${previousHours}`,
            );
            break;
          case 'cloudinary':
            await this.uploadToCloudinary(outputFilePathPreviousHour);
            break;
          default:
            break;
        }
        // Handle Cloudinary upload result as needed
      })
      .on('end', async () => {
        console.log('FFmpeg process finished');
        // resolve(); // Resolve the promise on completion
      });

    await ffmpegCommand.run(stream);
  }

  uploadToCloudinary = (filePath) => {
    return new Promise((resolve, reject) => {
      Cloudinary.uploader.upload(
        filePath,
        { resource_type: 'video' },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            console.log('Upload to Cloudinary successful:', result);
            resolve(result);
          }
        },
      );
    });
  };

  async checkRtspConnection(rtspUrl: string): Promise<boolean> {
    const ffmpegCommand = `ffmpeg -rtsp_transport tcp -i "${rtspUrl}" -t 5 -f null -`;

    try {
      const { stdout, stderr } = await execAsync(ffmpegCommand);
      console.log('FFmpeg output:', stdout);
      console.log('FFmpeg error output:', stderr);
      return true; // Connection successful
    } catch (error) {
      console.error('Error checking RTSP connection:', error);
      return false; // Connection failed
    }
  }

  private async uploadToGoogleCloud(
    camConfig: CamConfig,
    folderPath: string,
    directPath: string,
  ) {
    try {
      const providerConfig = camConfig.provider.config;

      const storage = new Storage({
        projectId: JSON.parse(camConfig.provider.identify).projectId,
        credentials: JSON.parse(camConfig.provider.identify),
      });

      const bucket = storage.bucket(providerConfig.name);
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = join(folderPath, file);
        const destination = `${directPath}/${file}`;

        await bucket.upload(filePath, {
          destination, // Adjust the destination as needed
        });

        if (file.includes('.m3u8')) {
          await this.storageRepository.insert(
            new StorageEntity({
              path: destination,
              name: file,
              url: `${providerConfig.link}/${providerConfig.name}`,
              link: providerConfig.link,
              idCamConfig: camConfig.id,
            }),
          );

          const existNotiDiscord = await this.notificationRepository.findOne({
            where: {
              idCam: camConfig.cam.id,
              channel: 'discord',
            },
          });
          let content = `File ${file} uploaded success to bucket : ${bucket.name} 
          link: ${providerConfig.link}/${providerConfig.name}/${destination}`;

          if (existNotiDiscord) {
            const baseService = new BaseService(existNotiDiscord.config.link);

            baseService.post('', {
              content,
            });
          }

          const existNotiEmail = await this.notificationRepository.findOne({
            where: {
              idCam: camConfig.cam.id,
              channel: 'email',
            },
          });

          if (existNotiEmail) {
            await this.handleSendMail(existNotiEmail.config, content);
          }
        }

        await fs.unlinkSync(filePath);
        console.log(destination, ' File deleted success =>', filePath);
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist, skipping upload.');
      } else {
        console.error('Error:', err);
      }
    }
  }
}
