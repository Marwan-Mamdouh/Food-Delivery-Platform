<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Explore Our Menu</h1>
        <p class="mt-2 text-gray-500">Delicious meals from top restaurants, delivered fast.</p>
      </div>
      <div v-if="restaurantId" class="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100 flex items-center gap-2">
        <span class="text-sm font-medium text-primary-700">Ordering from: </span>
        <span class="text-sm font-bold text-primary-900">{{ currentRestaurantName }}</span>
        <button @click="clearCart" class="ml-2 text-xs text-primary-600 hover:text-primary-700 underline font-medium">Reset</button>
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

    <!-- Menu Grid -->
    <div v-for="(group, restaurantId) in groupedMenu" :key="restaurantId" class="mb-16">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ group.name }}</h2>
        <div class="h-px flex-grow bg-gray-200"></div>
      </div>
      
      <div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <div v-for="item in group.items" :key="item.id" class="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div class="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-90 transition-opacity">
            <img :src="item.image" :alt="item.name" class="w-full h-48 object-center object-cover" />
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ item.name }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
              </div>
              <p class="text-lg font-bold text-primary-600">${{ item.price.toFixed(2) }}</p>
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
import { ref, computed } from 'vue'

const { addItem, restaurantId, clearCart } = useCart()
const showError = ref(false)

// Mock Data
const mockMenu = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil.',
    price: 12.99,
    restaurantId: 'rest-1',
    restaurantName: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Our signature thin crust topped with spicy pepperoni.',
    price: 14.99,
    restaurantId: 'rest-1',
    restaurantName: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and onion.',
    price: 9.99,
    restaurantId: 'rest-2',
    restaurantName: 'Burger King',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Cheeseburger',
    description: 'Classic burger with melted cheddar cheese.',
    price: 10.99,
    restaurantId: 'rest-2',
    restaurantName: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800'
  }
]

const groupedMenu = computed(() => {
  const groups: Record<string, { name: string, items: any[] }> = {}
  mockMenu.forEach(item => {
    if (!groups[item.restaurantId]) {
      groups[item.restaurantId] = { name: item.restaurantName, items: [] }
    }
    groups[item.restaurantId].items.push(item)
  })
  return groups
})

const currentRestaurantName = computed(() => {
  if (!restaurantId.value) return ''
  const item = mockMenu.find(i => i.restaurantId === restaurantId.value)
  return item ? item.restaurantName : 'Selected Restaurant'
})

const handleAddItem = (item: any) => {
  const res = addItem(item, item.image)
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
