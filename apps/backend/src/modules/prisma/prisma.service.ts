import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@food-delivery/db';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor() {
    // 1. Initialize the node-postgres Pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Initialize the Prisma pg adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to PrismaClient
    this.client = new PrismaClient({ adapter });
  }

  get userProfile(): PrismaClient['userProfile'] { return this.client.userProfile; }
  get restaurant(): PrismaClient['restaurant']  { return this.client.restaurant;  }
  get menuItem(): PrismaClient['menuItem']    { return this.client.menuItem;    }
  get order(): PrismaClient['order']       { return this.client.order;       }
  get orderItem(): PrismaClient['orderItem']   { return this.client.orderItem;   }

  get $transaction(): PrismaClient['$transaction'] {
    return this.client.$transaction.bind(this.client);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
