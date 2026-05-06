import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Restaurant } from '@food-delivery/db';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches all restaurants from the database.
   * @returns A promise that resolves to an array of strictly typed Restaurant objects.
   */
  async findAll(): Promise<Restaurant[]> {
    return await this.prisma.restaurant.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
