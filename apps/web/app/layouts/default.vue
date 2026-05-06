<template>
	<div
		class="min-h-screen bg-brand-light flex flex-col font-sans text-brand-dark"
	>
		<!-- Navigation Bar -->
		<nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<NuxtLink to="/" class="flex-shrink-0 flex items-center gap-2">
							<span class="text-2xl font-bold text-primary-600 tracking-tight"
								>DeliveryApp</span
							>
						</NuxtLink>
						<div class="hidden sm:ml-8 sm:flex sm:space-x-8">
							<NuxtLink
								to="/"
								class="border-transparent text-gray-500 hover:border-primary-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
							>
								Home
							</NuxtLink>
							<NuxtLink
								to="/menu"
								class="border-transparent text-gray-500 hover:border-primary-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
							>
								Menu
							</NuxtLink>
							<NuxtLink
								to="/orders"
								class="border-transparent text-gray-500 hover:border-primary-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
							>
								Orders
							</NuxtLink>
						</div>
					</div>
					          <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <BaseButton v-if="!user" @click="login">
              Sign In
            </BaseButton>
            <div v-else class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 font-medium">{{ user.email }}</span>
              <BaseButton variant="secondary" @click="logout">
                Sign Out
              </BaseButton>
            </div>
          </div>

					<!-- Mobile menu button -->
					<div class="flex items-center sm:hidden">
						<button
							@click="isMobileMenuOpen = !isMobileMenuOpen"
							class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
						>
							<span class="sr-only">Open main menu</span>
							<svg
								v-if="!isMobileMenuOpen"
								class="block h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
							<svg
								v-else
								class="block h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile menu -->
			<div
				v-show="isMobileMenuOpen"
				class="sm:hidden border-t border-gray-100 bg-white"
			>
				<div class="pt-2 pb-3 space-y-1">
					<NuxtLink
						to="/"
						class="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
						>Home</NuxtLink
					>
					<NuxtLink
						to="/menu"
						class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
						>Menu</NuxtLink
					>
					<NuxtLink
						to="/orders"
						class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
						>Orders</NuxtLink
					>
				</div>
				        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="!user" class="px-4">
            <BaseButton @click="login" custom-class="w-full">
              Sign In
            </BaseButton>
          </div>
          <div v-else class="px-4 space-y-3">
            <div class="text-base font-medium text-gray-800">{{ user.email }}</div>
            <BaseButton variant="secondary" @click="logout" custom-class="w-full">
              Sign Out
            </BaseButton>
          </div>
        </div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="flex-grow">
			<slot />
		</main>

		<!-- Footer -->
		<footer class="bg-white border-t border-gray-100 py-8 mt-auto">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p class="text-center text-sm text-gray-500">
					&copy; {{ new Date().getFullYear() }} DeliveryApp. All rights
					reserved.
				</p>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isMobileMenuOpen = ref(false);
const user = useSupabaseUser();
const supabase = useSupabaseClient();

// Dummy login/logout for now, replace with actual flows later
const login = () => {
	// We can implement actual Auth modal or redirect later
	console.log("Login clicked");
};

const logout = async () => {
	await supabase.auth.signOut();
};
</script>
