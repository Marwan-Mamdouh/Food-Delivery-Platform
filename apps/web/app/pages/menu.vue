<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Explore Our Menu</h1>
        <p class="mt-2 text-gray-500">Delicious meals from top restaurants, delivered fast.</p>
      </div>
    <div v-if="cartRestaurantId" class="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100 flex items-center gap-2">
        <span class="text-sm font-medium text-primary-700">Ordering from: </span>
        <span class="text-sm font-bold text-primary-900">{{ cartRestaurantName }}</span>
        <button @click="clearCart" class="ml-2 text-xs text-primary-600 hover:text-primary-700 underline font-medium">Reset</button>
      </div>
    </div>

    <!-- Error State for Restaurants -->
    <div v-if="restaurantsError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
      <p class="font-bold">Failed to load restaurants</p>
      <p class="text-sm">Please make sure the backend server is running on {{ apiBase }}.</p>
      <button @click="refreshRestaurants" class="mt-2 text-sm underline font-medium">Try again</button>
    </div>

    <!-- Restaurant Selector -->
    <div class="mb-12">
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">Select a restaurant</label>
        <select 
          id="tabs" 
          name="tabs" 
          class="block w-full focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
          v-model="selectedRestaurantId"
        >
          <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
            {{ restaurant.name }}
          </option>
        </select>
      </div>
      <div class="hidden sm:block">
        <nav class="flex space-x-4" aria-label="Tabs">
          <button
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            @click="selectedRestaurantId = restaurant.id"
            :class="[
              selectedRestaurantId === restaurant.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
              'px-4 py-2 font-medium text-sm rounded-lg transition-all duration-200'
            ]"
          >
            {{ restaurant.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Error Toast (Simplified) -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showError" class="fixed bottom-10 right-10 z-50 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p class="font-bold">Cannot add item!</p>
          <p class="text-sm opacity-90">Your cart contains items from a different restaurant. Clear your cart first to order from here.</p>
        </div>
        <button @click="showError = false" class="ml-auto hover:bg-red-700 p-1 rounded">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="menuPending" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-500">Loading delicious menu...</p>
    </div>

    <!-- Menu Grid -->
    <div v-else v-for="(items, category) in categorizedMenu" :key="category" class="mb-16">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ category }}</h2>
        <div class="h-px flex-grow bg-gray-200"></div>
      </div>
      
      <div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <div v-for="item in items" :key="item.id" class="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div class="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-90 transition-opacity">
            <img :src="item.image || '/images/placeholder-food.jpg'" :alt="item.name" class="w-full h-48 object-center object-cover" />
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ item.name }}</h3>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
              </div>
              <p class="text-lg font-bold text-primary-600">${{ Number(item.price).toFixed(2) }}</p>
            </div>
            <div class="mt-6">
              <BaseButton 
                @click="handleAddItem(item)" 
                variant="outline" 
                custom-class="w-full"
              >
                Add to Cart
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Restaurant, MenuItem } from '@food-delivery/db'

const { addItem, restaurantId: cartRestaurantId, clearCart } = useCart()
const showError = ref(false)
const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl

// 1. Fetch all restaurants
const { data: restaurants, error: restaurantsError, refresh: refreshRestaurants } = await useFetch<Restaurant[]>(`${apiBase}/restaurant`)

// 2. Selected Restaurant State
// Initialize with cart restaurant or the first available restaurant
const selectedRestaurantId = ref<string | null>(
  cartRestaurantId.value || (restaurants.value && restaurants.value.length > 0 ? restaurants.value[0].id : null)
)

// 3. Fetch menu for selected restaurant
const { data: categorizedMenu, pending: menuPending } = await useFetch<Record<string, MenuItem[]>>(() => 
  selectedRestaurantId.value ? `${apiBase}/menu/${selectedRestaurantId.value}` : null,
  {
    key: `menu-${selectedRestaurantId.value}`,
    watch: [selectedRestaurantId]
  }
)

const selectedRestaurant = computed(() => 
  restaurants.value?.find(r => r.id === selectedRestaurantId.value)
)

const cartRestaurantName = computed(() => {
  if (!cartRestaurantId.value) return ''
  const restaurant = restaurants.value?.find(r => r.id === cartRestaurantId.value)
  return restaurant ? restaurant.name : 'Restaurant'
})

const handleAddItem = (item: MenuItem) => {
  const res = addItem(item, item.image || '/images/placeholder-food.jpg')
  if (!res.success && res.error === 'DIFFERENT_RESTAURANT') {
    showError.value = true
    // Auto-hide error after 4 seconds
    setTimeout(() => {
      showError.value = false
    }, 4000)
  } else {
    showError.value = false
  }
}

useHead({
  title: 'Menu - DeliveryApp'
})
</script>
