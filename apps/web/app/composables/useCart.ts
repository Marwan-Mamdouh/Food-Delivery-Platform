import { computed, watch, onMounted } from 'vue'
import type { MenuItem } from '@food-delivery/db'

export interface CartItem extends Pick<MenuItem, 'id' | 'name' | 'price' | 'restaurantId'> {
  quantity: number
  image: string
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
}

/**
 * useCart composable for managing the shopping cart state.
 * Handles item additions, restaurant integrity, and persistence.
 */
export const useCart = () => {
  // SSR-safe state using Nuxt's useState
  const cartState = useState<CartState>('cart', () => ({
    items: [],
    restaurantId: null
  }))

  /**
   * Hydrate state from localStorage on the client side.
   */
  onMounted(() => {
    if (import.meta.client) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart) as CartState
          cartState.value = parsed
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e)
        }
      }
    }
  })

  /**
   * Persist state to localStorage on any change.
   */
  watch(
    () => cartState.value,
    (newState) => {
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(newState))
      }
    },
    { deep: true }
  )

  /**
   * Computed: Total number of items in the cart.
   */
  const itemCount = computed(() => {
    return cartState.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * Computed: Subtotal price of all items.
   */
  const subtotal = computed(() => {
    return cartState.value.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  /**
   * Computed: Formatted total price string (e.g., "$10.00").
   */
  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(subtotal.value)
  })

  /**
   * Computed: Items mapped to the structure expected by the backend OrderItemDto.
   * Maps 'id' to 'menuItemId' to satisfy backend validation.
   */
  const backendItems = computed(() => {
    return cartState.value.items.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity
    }))
  })

  /**
   * Adds an item to the cart.
   * @param item The MenuItem to add.
   * @param image An image URL for the item.
   * @returns { success: boolean; error?: 'DIFFERENT_RESTAURANT' }
   */
  const addItem = (item: MenuItem, image: string = '/images/placeholder-food.jpg') => {
    // Check if adding from a different restaurant
    if (cartState.value.restaurantId && cartState.value.restaurantId !== item.restaurantId) {
      return { success: false, error: 'DIFFERENT_RESTAURANT' as const }
    }

    // Set restaurantId if this is the first item
    if (!cartState.value.restaurantId) {
      cartState.value.restaurantId = item.restaurantId
    }

    const existingItem = cartState.value.items.find((i) => i.id === item.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      cartState.value.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: item.restaurantId,
        quantity: 1,
        image
      })
    }

    return { success: true }
  }

  /**
   * Removes an item from the cart or decrements its quantity.
   * @param itemId The unique ID of the item to remove.
   */
  const removeItem = (itemId: string) => {
    const index = cartState.value.items.findIndex((i) => i.id === itemId)
    
    if (index > -1) {
      const item = cartState.value.items[index]
      if (item.quantity > 1) {
        item.quantity--
      } else {
        cartState.value.items.splice(index, 1)
      }
    }

    // Reset restaurantId if cart is empty
    if (cartState.value.items.length === 0) {
      cartState.value.restaurantId = null
    }
  }

  /**
   * Clears all items from the cart and resets the restaurant association.
   */
  const clearCart = () => {
    cartState.value.items = []
    cartState.value.restaurantId = null
  }

  return {
    items: computed(() => cartState.value.items),
    restaurantId: computed(() => cartState.value.restaurantId),
    itemCount,
    subtotal,
    formattedTotal,
    backendItems,
    addItem,
    removeItem,
    clearCart
  }
}
