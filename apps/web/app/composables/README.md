# Composables Documentation

This directory contains reusable Vue composables for the web application, providing shared state and logic.

## `useCart`
The `useCart` composable provides a robust, SSR-safe management system for the shopping cart. It handles state across pages, persistent storage via `localStorage`, and business rules like restaurant-specific cart validation.

### State & Computed Properties
- `items`: An array of `CartItem` objects currently in the cart.
- `restaurantId`: The unique ID of the restaurant the current cart is associated with.
- `itemCount`: Computed total number of items in the cart.
- `subtotal`: Computed total price of all items.
- `formattedTotal`: A locale-formatted currency string of the subtotal.

### Methods
- `addItem(item: MenuItem, image: string)`: Adds an item. Returns `{ success: boolean, error?: 'DIFFERENT_RESTAURANT' }` if a validation error occurs.
- `removeItem(itemId: string)`: Decrements quantity or removes the item entirely if the quantity is 1.
- `clearCart()`: Resets the cart state and restaurant association.

### Usage
```typescript
const { addItem, items, itemCount } = useCart()

const handleAdd = (item) => {
  const result = addItem(item)
  if (!result.success && result.error === 'DIFFERENT_RESTAURANT') {
     // Handle multi-restaurant error
  }
}
```

### Potential Issues & Errors
- **LocalStorage**: If `localStorage` is unavailable or cleared, the cart state will reset on refresh.
- **SSR Hydration**: Since `onMounted` is used for hydration from `localStorage`, initial SSR rendering will show an empty cart. This is expected behavior to prevent mismatch errors.
