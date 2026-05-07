<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
      <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h1>
    <p class="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
      Thank you for your order. We've received it and the restaurant is now preparing your food. 
      You can track your order status in the "Orders" section.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <NuxtLink to="/">
        <BaseButton size="lg">
          Return to Home
        </BaseButton>
      </NuxtLink>
      <NuxtLink to="/orders">
        <BaseButton variant="secondary" size="lg">
          View My Orders
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Order Success - DeliveryApp'
})
</script>
