<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Your Orders</h1>
        <p class="mt-2 text-sm text-gray-600">Check the status of your recent orders and reorder your favorites.</p>
      </div>
      <NuxtLink to="/menu" class="mt-4 md:mt-0">
        <BaseButton variant="secondary" size="sm">
          Browse Menu
        </BaseButton>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
      {{ errorMessage }}
    </div>

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="space-y-8">
      <div v-for="order in orders" :key="order.id" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Order Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div class="flex items-center space-x-4">
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Placed</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="hidden sm:block border-l border-gray-300 h-8"></div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</p>
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(Number(order.totalPrice)) }}</p>
            </div>
            <div class="hidden sm:block border-l border-gray-300 h-8"></div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</p>
              <p class="text-sm font-medium text-gray-900">#{{ order.id.slice(-8).toUpperCase() }}</p>
            </div>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-3">
             <span :class="getStatusClasses(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase">
              {{ order.status }}
            </span>
            <span :class="getPaymentStatusClasses(order.paymentStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase">
              {{ order.paymentStatus }}
            </span>
          </div>
        </div>

        <!-- Order Body -->
        <div class="px-6 py-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center mb-6">
               <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mr-4">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ order.restaurant?.name || 'Restaurant' }}</h3>
                <p class="text-sm text-gray-500">{{ order.address }}</p>
              </div>
            </div>
          </div>

          <!-- Items List -->
          <ul class="divide-y divide-gray-100 border-t border-gray-100 mt-4">
            <li v-for="item in order.items" :key="item.id" class="py-4 flex items-center justify-between">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0 mr-4">
                  <img v-if="item.menuItem?.image" :src="item.menuItem.image" :alt="item.menuItem.name" class="h-10 w-10 rounded-md object-cover" />
                  <div v-else class="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ item.menuItem?.name || 'Item' }}</p>
                  <p class="text-xs text-gray-500">Qty: {{ item.quantity }} × {{ formatCurrency(Number(item.price)) }}</p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(Number(item.price) * item.quantity) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900">No orders yet</h2>
      <p class="mt-2 text-gray-500 max-w-xs mx-auto">Once you place an order, it will appear here in your order history.</p>
      <div class="mt-8">
        <NuxtLink to="/menu">
          <BaseButton size="lg">
            Browse Menu
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrder, type Order } from '~/composables/useOrder'

const { getUserOrders, errorMessage, isLoading } = useOrder()
const orders = ref<Order[]>([])
const loading = ref(true)

const fetchOrders = async () => {
  try {
    const data = await getUserOrders()
    orders.value = data
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const getStatusClasses = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getPaymentStatusClasses = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  fetchOrders()
})

useHead({
  title: 'Order History - DeliveryApp'
})
</script>
