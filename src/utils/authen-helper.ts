import * as crypto from 'crypto';

const iv = crypto.randomBytes(16);
const algorithm = 'aes-256-ctr';
export const encryptStr = (strToEncrypt: string, encryptKey: string) => {
  const jsonString = JSON.stringify(strToEncrypt);
  const cipher = crypto.createCipheriv(algorithm, encryptKey, iv);
  const encrypted = Buffer.concat([cipher.update(jsonString), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptStr = (strToDecrypt: string, encryptKey: string) => {
  const [iv, content] = strToDecrypt.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptKey,
    Buffer.from(iv, 'hex'),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString());
};
