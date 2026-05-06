# Order Module

The `OrderModule` manages the end-to-end order placement process, including validation, secure price calculation, and status tracking.

## Functionality
- **Secure Ordering:** `OrderService` calculates the total price based on server-side database records rather than relying on client-submitted prices, preventing price manipulation.
- **Transactional Integrity:** Uses Prisma transactions to ensure that both the `Order` and its constituent `OrderItems` are created atomically.
- **Payment Simulation:** Includes a mock payment flow that assigns `PaymentStatus` and `OrderStatus` based on a success rate.
- **Validation:** Ensures that items listed in the order exist and belong to the specified restaurant.

## Usage
To place an order via the `OrderController`:

```typescript
// Expects POST body matching PlaceOrderDto: { restaurantId: string, address: string, items: { menuItemId: string, quantity: number }[] }
@Post()
@UseGuards(SupabaseAuthGuard)
async placeOrder(@Req() req, @Body() body: PlaceOrderDto) {
  const userId = req.user.id;
  return await this.orderService.placeOrder(userId, body);
}
```

## Potential Issues & Errors
- **Validation Failures:** If items are not found or do not belong to the targeted restaurant, a `BadRequestException` is thrown.
- **Payment Logic:** Currently, the payment is a mock. Transitioning to a real payment gateway (e.g., Stripe) will require significant changes to the `OrderService`.
- **Concurrency/Race Conditions:** While transactions are used, high-concurrency order placement might need further investigation if inventory management is added in the future.
