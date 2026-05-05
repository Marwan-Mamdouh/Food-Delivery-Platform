import { BadRequestException, Injectable } from '@nestjs/common';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, OrderStatus } from '@food-delivery/db';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Places an order securely by calculating prices server-side
   * and executing all creations within a single transaction.
   */
  async placeOrder(userId: string, placeOrderDto: PlaceOrderDto) {
    const { restaurantId, address, items } = placeOrderDto;

    // 1. Fetch menu items to verify existence, restaurant match, and secure prices.
    const itemIds = items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        restaurantId, // Ensure items actually belong to the targeted restaurant
      },
    });

    if (menuItems.length !== items.length) {
      throw new BadRequestException(
        'Some menu items are invalid or do not belong to the selected restaurant.',
      );
    }

    // 2. Calculate the total price securely
    let totalPrice = 0;
    const priceMap: Record<string, number> = {};

    for (const dbItem of menuItems) {
      priceMap[dbItem.id] = dbItem.price;
      const requestedItem = items.find((i) => i.menuItemId === dbItem.id);
      if (requestedItem) {
        totalPrice += dbItem.price * requestedItem.quantity;
      }
    }

    // 3. Mock Payment Logic (90% success rate)
    const isPaymentSuccessful = Math.random() > 0.1;
    const paymentStatus = isPaymentSuccessful
      ? PaymentStatus.PAID
      : PaymentStatus.FAILED;
    const orderStatus = isPaymentSuccessful
      ? OrderStatus.CONFIRMED
      : OrderStatus.CANCELLED;

    // 4. Create Order and nested OrderItems in a single Prisma transaction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId,
          restaurantId,
          address,
          totalPrice,
          paymentStatus,
          status: orderStatus,
          items: {
            create: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              // We snapshot the price at the time of purchase
              price: priceMap[item.menuItemId],
            })),
          },
        },
        include: {
          // Return the related items to verify successful insertion
          items: true,
        },
      });
    });

    return createdOrder;
  }
}
