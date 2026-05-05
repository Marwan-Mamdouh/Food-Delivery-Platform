import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => ({
  projectUrl: process.env.SUPABASE_PROJECT_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  jwtSecret: process.env.SUPABASE_JWT_SECRET,
}));
