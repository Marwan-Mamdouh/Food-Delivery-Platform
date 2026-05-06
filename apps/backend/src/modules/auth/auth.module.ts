import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase' })],
  providers: [SupabaseStrategy, SupabaseAuthGuard],
  exports: [PassportModule, SupabaseStrategy, SupabaseAuthGuard],
})
export class AuthModule {}
