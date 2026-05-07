import { ref } from 'vue'

export interface OrderItemDto {
  menuItemId: string
  quantity: number
}

export interface PlaceOrderDto {
  restaurantId: string
  address: string
  items: OrderItemDto[]
}

export const useOrder = () => {
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const config = useRuntimeConfig()
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  /**
   * Places an order via the backend API.
   * @param restaurantId ID of the restaurant.
   * @param address Delivery address.
   * @param items List of items to order.
   * @returns The created order object.
   */
  const placeOrder = async (restaurantId: string, address: string, items: OrderItemDto[]) => {
    if (!user.value) {
      errorMessage.value = 'You must be signed in to place an order.'
      throw new Error(errorMessage.value)
    }

    isLoading.value = true
    errorMessage.value = null

    try {
      const response = await $fetch<any>(`${config.public.apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.value?.access_token}`
        },
        body: {
          restaurantId,
          address,
          items
        } as PlaceOrderDto
      })

      return response
    } catch (err: any) {
      console.error('Order placement failed:', err)
      
      // Handle payment failure specifically if possible from response
      if (err.data?.paymentStatus === 'FAILED') {
        errorMessage.value = 'Payment failed. Please try again.'
      } else {
        errorMessage.value = err.data?.message || 'Failed to place order. Please try again later.'
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    placeOrder,
    isLoading,
    errorMessage
  }
}
