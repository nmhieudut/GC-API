import env from 'dotenv';
env.config();

export const isDev = process.env.NODE_ENV === 'development';
export const jwt_key = process.env.SECRET_KEY;
