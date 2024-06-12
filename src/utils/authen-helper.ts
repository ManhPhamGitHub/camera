import CryptoJS from 'crypto-js';

export const encryptStr = (data, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
};
export const decryptStr = (cipherText, secret) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
