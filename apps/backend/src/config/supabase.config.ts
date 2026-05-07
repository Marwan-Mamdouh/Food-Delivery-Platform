import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => {
  const projectUrl = process.env.SUPABASE_PROJECT_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  return {
    projectUrl,
    anonKey,
    jwtSecret,
  };
});
