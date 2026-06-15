import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { PlaceOrderDto } from './dto/place-order.dto.js';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard.js';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface.js';
import { Prisma } from '@food-delivery/db';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async findAllByUser(
    @Req() req: AuthRequest,
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>[]> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.orderService.findAllByUser(userId);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  async placeOrder(
    @Req() req: AuthRequest,
    @Body() placeOrderDto: PlaceOrderDto,
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>> {
    // The user payload is attached to the request by the SupabaseStrategy
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }

    return this.orderService.placeOrder(userId, placeOrderDto);
  }
}
