import env from 'dotenv';
env.config();
export const jwt_key = process.env.SECRET_KEY;
