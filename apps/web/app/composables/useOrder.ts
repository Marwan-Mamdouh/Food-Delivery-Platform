import { ref } from "vue";

export interface OrderItemDto {
	menuItemId: string;
	quantity: number;
}

export interface PlaceOrderDto {
	restaurantId: string;
	address: string;
	items: OrderItemDto[];
}

export interface OrderItem {
	id: string;
	orderId: string;
	menuItemId: string;
	quantity: number;
	price: string | number;
	createdAt: string | Date;
}

export interface Order {
	id: string;
	userId: string;
	restaurantId: string;
	status: string;
	paymentStatus: string;
	totalPrice: string | number;
	address: string;
	items: OrderItem[];
	createdAt: string | Date;
	updatedAt: string | Date;
}

export const useOrder = () => {
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);
	const config = useRuntimeConfig();
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const session = useSupabaseSession();

	const getAccessToken = async () => {
		if (session.value?.access_token) {
			return session.value.access_token;
		}

		const { data, error } = await supabase.auth.getSession();
		if (error || !data.session?.access_token) {
			throw new Error(
				"Unable to place order: no authenticated session token available.",
			);
		}

		return data.session.access_token;
	};

	/**
	 * Places an order via the backend API.
	 * @param restaurantId ID of the restaurant.
	 * @param address Delivery address.
	 * @param items List of items to order.
	 * @returns The created order object.
	 */
	const placeOrder = async (
		restaurantId: string,
		address: string,
		items: OrderItemDto[],
	) => {
		if (!user.value && !session.value?.access_token) {
			errorMessage.value = "You must be signed in to place an order.";
			throw new Error(errorMessage.value);
		}

		const accessToken = await getAccessToken();

		isLoading.value = true;
		errorMessage.value = null;

		try {
			const response = await $fetch<Order>(
				`${config.public.apiBaseUrl}/api/orders`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					body: {
						restaurantId,
						address,
						items,
					} as PlaceOrderDto,
				},
			);

			return response;
		} catch (err: unknown) {
			// Type-safe error handling for $fetch (Nuxt/OhMyFetch)
			const fetchError = err as { 
				data?: { message?: string; paymentStatus?: string }; 
				status?: number; 
				statusCode?: number 
			};
			const errorData = fetchError.data;
			const errorStatus = fetchError.status || fetchError.statusCode;

			if (errorStatus === 401) {
				errorMessage.value =
					"Authorization failed. Please sign in again and retry checkout.";
			} else if (errorData?.paymentStatus === "FAILED") {
				errorMessage.value = "Payment failed. Please try again.";
			} else {
				errorMessage.value =
					errorData?.message || "Failed to place order. Please try again later.";
			}

			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	return {
		placeOrder,
		isLoading,
		errorMessage,
	};
};
