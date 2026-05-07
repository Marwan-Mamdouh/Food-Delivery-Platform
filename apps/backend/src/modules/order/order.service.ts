import { BadRequestException, Injectable } from '@nestjs/common';
import { PlaceOrderDto } from './dto/place-order.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentStatus, OrderStatus, Prisma } from '@food-delivery/db';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(
    userId: string,
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Places an order securely by calculating prices server-side
   * and executing all creations within a single transaction.
   */
  async placeOrder(
    userId: string,
    placeOrderDto: PlaceOrderDto,
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }>> {
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
    const priceMap: Record<string, Prisma.Decimal> = {};

    for (const dbItem of menuItems) {
      priceMap[dbItem.id] = dbItem.price;
      const requestedItem = items.find((i) => i.menuItemId === dbItem.id);
      if (requestedItem) {
        // Convert to number for arithmetic operation
        totalPrice += Number(dbItem.price) * requestedItem.quantity;
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
      return await tx.order.create({
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

  /**
   * Fetches all orders for a specific user, including related restaurant and items.
   * @param userId The ID of the user.
   * @returns A list of orders with nested details.
   */
  async findAllForUser(
    userId: string,
  ): Promise<
    Prisma.OrderGetPayload<{
      include: { restaurant: true; items: { include: { menuItem: true } } };
    }>[]
  > {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        restaurant: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
