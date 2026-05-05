import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  @UseGuards(SupabaseAuthGuard)
  async placeOrder(
    @Req() req: AuthRequest,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    // The user payload is attached to the request by the SupabaseStrategy
    const userId = req.user.userId;
    return this.orderService.placeOrder(userId, placeOrderDto);
  }
}
