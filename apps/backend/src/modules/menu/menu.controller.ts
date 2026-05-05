import { Controller, Get, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItem } from '@food-delivery/db';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get(':restaurantId')
  async getMenu(@Param('restaurantId') restaurantId: string): Promise<Record<string, MenuItem[]>> {
    return this.menuService.getMenuForRestaurant(restaurantId);
  }
}
