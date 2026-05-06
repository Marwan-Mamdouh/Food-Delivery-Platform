<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>

    <div v-if="items.length > 0" class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
      <!-- Item List -->
      <section class="lg:col-span-7">
        <ul class="border-t border-b border-gray-200 divide-y divide-gray-200">
          <li v-for="item in items" :key="item.id" class="flex py-6 sm:py-10">
            <div class="flex-shrink-0">
              <img :src="item.image" :alt="item.name" class="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32" />
            </div>

            <div class="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
              <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                <div>
                  <div class="flex justify-between">
                    <h3 class="text-sm">
                      <span class="font-medium text-gray-700 hover:text-gray-800">{{ item.name }}</span>
                    </h3>
                  </div>
                  <p class="mt-1 text-sm font-medium text-gray-900">{{ formatCurrency(item.price) }}</p>
                </div>

                <div class="mt-4 sm:mt-0 sm:pr-9">
                  <div class="flex items-center space-x-3">
                    <button 
                      @click="removeItem(item.id)"
                      class="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="text-gray-700 font-medium w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      @click="handleAddItem(item)"
                      class="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <div class="absolute top-0 right-0">
                    <button @click="handleRemoveAll(item.id)" class="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors">
                      <span class="sr-only">Remove</span>
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <!-- Order Summary -->
      <section class="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 shadow-sm">
        <h2 class="text-lg font-medium text-gray-900">Order summary</h2>

        <dl class="mt-6 space-y-4">
          <div class="flex items-center justify-between">
            <dt class="text-sm text-gray-600">Subtotal</dt>
            <dd class="text-sm font-medium text-gray-900">{{ formattedTotal }}</dd>
          </div>
          <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt class="flex items-center text-sm text-gray-600">
              <span>Shipping estimate</span>
            </dt>
            <dd class="text-sm font-medium text-gray-900">$5.00</dd>
          </div>
          <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt class="text-base font-medium text-gray-900">Order total</dt>
            <dd class="text-base font-medium text-gray-900">{{ formatCurrency(subtotal + 5) }}</dd>
          </div>
        </dl>

        <div class="mt-6">
          <BaseButton custom-class="w-full" size="lg">
            Checkout
          </BaseButton>
        </div>
        
        <div class="mt-4">
          <button @click="clearCart" class="w-full text-center text-sm text-red-600 hover:text-red-500 font-medium transition-colors">
            Clear Cart
          </button>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <svg class="mx-auto h-24 w-24 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 class="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
      <p class="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
      <div class="mt-8">
        <NuxtLink to="/">
          <BaseButton size="lg">
            Start Shopping
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/composables/useCart'

const { items, subtotal, formattedTotal, addItem, removeItem, clearCart } = useCart()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const handleAddItem = (item: CartItem) => {
  // Pass the item back to addItem. Since it's already in the cart, restaurantId check will pass.
  // We need to cast back to MenuItem or just pass properties
  addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    restaurantId: item.restaurantId
  } as any, item.image)
}

const handleRemoveAll = (itemId: string) => {
  // Decrement until zero (simple implementation)
  const item = items.value.find(i => i.id === itemId)
  if (item) {
    for (let i = 0; i < item.quantity; i++) {
      removeItem(itemId)
    }
  }
}

useHead({
  title: 'Your Cart - DeliveryApp'
})
</script>
