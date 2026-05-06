# Restaurant Module

The `RestaurantModule` manages data related to restaurants, primarily for listing available options.

## Functionality
- **Listing:** `RestaurantService` provides a method to fetch all restaurants ordered by their creation date in descending order.

## Usage
To use the `RestaurantService` in a controller:

```typescript
import { Controller, Get } from '@nestjs/common';
import { RestaurantService } from './restaurant.service.js';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getAll() {
    return await this.restaurantService.findAll();
  }
}
```

## Potential Issues & Errors
- **Performance:** As the number of restaurants grows, `findAll` will become inefficient. Pagination should be implemented as the dataset expands.
- **Database Latency:** Slow database queries directly affect the responsiveness of the restaurant listing endpoint.
