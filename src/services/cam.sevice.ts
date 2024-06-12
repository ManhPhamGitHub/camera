import { Cam, CamConfig } from '@entities';
import { Injectable } from '@nestjs/common';
import { CamRepository } from '@repositories';
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

const execAsync = promisify(exec);

@Injectable()
export class CamService {
  constructor(private CamRepository: CamRepository) {}
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

  async startStreaming(camConfig: CamConfig): Promise<void> {
    const stream = new PassThrough();
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const previousHours = String(currentDate.getHours() - 2).padStart(2, '0');
    const folderPath = join(
      __dirname,
      `../storage/${camConfig.cam.name}/${year}-${month}-${day}`,
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const formattedDate = `${year}-${month}-${day}_${hours}`;
    const fileName = `output_${formattedDate}.mp4`;
    const fileNamePreviousHours = `output_${year}-${month}-${day}_${previousHours}.mp4`;
    const playlistName = `output_${formattedDate}.m3u8`;
    const playlistNamePreviousHours = `output_${year}-${month}-${day}_${previousHours}.m3u8`;

    const segmentFileName = `segment_${formattedDate}_%03d.ts`;
    const playlistPath = join(folderPath, playlistName);
    const playlistPathPreviousHours = join(
      folderPath,
      playlistNamePreviousHours,
    );
    console.log('S12312321', fileName);

    const segmentPath = join(folderPath, segmentFileName);
    // Upload the recorded MP4 file to Cloudinary with the generated filename
    const outputFilePath = join(folderPath, fileName);
    const outputFilePathPreviousHour = join(folderPath, fileNamePreviousHours);

    // Create an ffmpeg process to read from the camera URL
    const ffmpegCommand = ffmpeg(camConfig.input)
      .inputOptions(['-rtsp_transport tcp'])
      // .outputOptions([
      //   '-c:v libx264',
      //   '-vf scale=1280:720',
      //   '-f segment',
      //   '-segment_time 3600',
      //   '-reset_timestamps 1',
      //   '-strftime 1',
      // ])
      .outputOptions([
        '-c:v libx264',
        '-vf scale=1280:720',
        '-f hls',
        '-hls_time 2',
        '-hls_list_size 5',
        '-hls_flags delete_segments',
        `-hls_segment_filename ${segmentPath}`,
      ])
      .output(playlistPath)

      // .output(outputFilePath)
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        stream.end();
        // reject(err); // Reject the promise on error
      })
      .on('start', async (commandLine) => {
        console.log('Spawned FFmpeg with command:', commandLine);
        switch (camConfig.provider.name) {
          case 'google':
            await this.uploadToGoogleCloud(
              camConfig,
              playlistPathPreviousHours,
              playlistNamePreviousHours,
              `${year}-${month}-${day}`,
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
    filePath: string,
    fileName: string,
    folderName: string,
  ) {
    try {
      const storage = new Storage({
        projectId: JSON.parse(camConfig.provider.config).projectId,
        credentials: JSON.parse(camConfig.provider.identify),
      });
      console.log('uploadToGoogleCloud progress => ', filePath);
      await fs.promises.access(filePath, fs.constants.F_OK);

      const bucket = storage.bucket('ducmanhpham');

      const destination = `${folderName}/${fileName}`;
      await bucket.upload(filePath, {
        destination,
        metadata: {
          contentType: 'video/mp4',
        },
      });
      console.log(`File uploaded to ${destination}`);

      await fs.unlinkSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist, skipping upload.');
      } else {
        console.error('Error:', err);
      }
    }
  }
}
