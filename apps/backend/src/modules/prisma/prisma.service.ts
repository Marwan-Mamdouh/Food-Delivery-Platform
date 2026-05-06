import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@food-delivery/db';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Initializes the Prisma connection when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Closes the Prisma connection when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
