import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { MenuItem } from '@food-delivery/db';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches the menu items for a given restaurant and groups them by category.
   * @param restaurantId The UUID of the restaurant.
   * @returns A strictly typed Record mapping category strings to arrays of MenuItems.
   */
  async getMenuForRestaurant(
    restaurantId: string,
  ): Promise<Record<string, MenuItem[]>> {
    const items = await this.prisma.menuItem.findMany({
      where: {
        restaurantId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Group items by category
    const categorizedMenu: Record<string, MenuItem[]> = {};

    for (const item of items) {
      // Use 'Uncategorized' if the category is null
      const category = item.category || 'Uncategorized';

      if (!categorizedMenu[category]) {
        categorizedMenu[category] = [];
      }
      categorizedMenu[category].push(item);
    }

    return categorizedMenu;
  }
}
