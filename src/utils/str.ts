import * as bcrypt from 'bcryptjs';
import * as slug from 'slug';

export const hashPassword = async (password: string) => {
  let hashedPassword = null;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log('Error when hash password');
    hashedPassword = null;
  }

  return hashedPassword;
};

export const verifyHashPassword = async (
  password: string,
  hashedPassword: string,
) => {
  let verifyPassword = false;
  try {
    verifyPassword = await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    verifyPassword = false;
  }

  return verifyPassword;
};

export const slugStr = (value: string) => {
  return slug(value, '_');
};
