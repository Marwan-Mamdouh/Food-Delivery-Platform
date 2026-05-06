# Prisma Module

The `PrismaModule` provides a centralized service for interacting with the database using the Prisma ORM.

## Functionality
- **Database Client:** Extends `PrismaClient` to provide a connection to the PostgreSQL database.
- **Lifecycle Management:** Implements `OnModuleInit` and `OnModuleDestroy` to ensure the database connection is opened when the backend starts and gracefully closed when it shuts down.

## Usage
Inject the `PrismaService` into any service where database interaction is needed:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.restaurant.findMany();
  }
}
```

## Potential Issues & Errors
- **Connection Failures:** Network issues between the backend and the database, or incorrect connection strings in the environment variables, will prevent the module from starting.
- **Migrations:** If the database schema is outdated relative to the Prisma client, queries may fail at runtime.
- **Pool Exhaustion:** Under heavy load, if the connection pool limit is reached, queries may timeout or throw connection errors.
