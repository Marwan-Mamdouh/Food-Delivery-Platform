# Auth Module

The `AuthModule` handles authentication within the backend application. It integrates with Supabase to validate JSON Web Tokens (JWT) provided by clients.

## Functionality
- **Strategy Management:** Provides `SupabaseStrategy` which integrates with Passport to handle Supabase authentication.
- **Guard Enforcement:** Exports `SupabaseAuthGuard` for use in controllers to protect sensitive routes.
- **Passport Integration:** Registers the default strategy as `supabase`.

## Usage
To protect a route, import and use the `SupabaseAuthGuard`:

```typescript
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../modules/auth/guards/supabase-auth.guard.js';

@Controller('protected')
export class ProtectedController {
  @UseGuards(SupabaseAuthGuard)
  @Get()
  getSecret() {
    return 'This is protected data';
  }
}
```

## Potential Issues & Errors
- **Token Validation Errors:** If the JWT sent in the request header is expired, malformed, or signed by an untrusted issuer, the authentication will fail.
- **Supabase Configuration:** Incorrect environment variables (e.g., Supabase project URL, JWT secret) will prevent successful token verification.
- **Guard Misuse:** Forgetting to use the `SupabaseAuthGuard` decorator on a controller or route that requires authentication will leave that endpoint publicly accessible.
