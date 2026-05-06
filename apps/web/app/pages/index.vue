<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center">
      <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span class="block">Welcome to</span>
        <span class="block text-primary-600">Premium Food Delivery</span>
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Order from your favorite restaurants and get it delivered to your door in minutes.
      </p>
      <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <BaseButton size="lg" @click="navigateTo('/menu')">
          View Menu
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta and imports
useHead({
  title: 'Home - DeliveryApp',
  meta: [
    { name: 'description', content: 'Premium food delivery app' }
  ]
})
</script>
