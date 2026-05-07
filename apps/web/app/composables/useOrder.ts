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

export interface MenuItem {
	id: string;
	name: string;
	price: string | number;
	image: string | null;
}

export interface OrderItem {
	id: string;
	orderId: string;
	menuItemId: string;
	quantity: number;
	price: string | number;
	createdAt: string | Date;
	menuItem?: MenuItem;
}

export interface Restaurant {
	id: string;
	name: string;
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
	restaurant?: Restaurant;
	createdAt: string | Date;
	updatedAt: string | Date;
}

interface FetchError {
	data?: { message?: string; paymentStatus?: string };
	status?: number;
	statusCode?: number;
}

export const useOrder = () => {
	const isLoading = ref(false);
	const errorMessage = ref<string | null>(null);
	const config = useRuntimeConfig();
	const supabase = useSupabaseClient();
	const session = useSupabaseSession();

	const getAccessToken = async () => {
		if (session.value?.access_token) {
			return session.value.access_token;
		}

		const { data, error } = await supabase.auth.getSession();
		if (error || !data.session?.access_token) {
			throw new Error(
				"Unable to access orders: no authenticated session token available.",
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
			const fetchError = err as FetchError;
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

	/**
	 * Fetches all orders for the authenticated user.
	 * @returns A list of orders.
	 */
	const getUserOrders = async () => {
		const accessToken = await getAccessToken();

		isLoading.value = true;
		errorMessage.value = null;

		try {
			const response = await $fetch<Order[]>(
				`${config.public.apiBaseUrl}/api/orders`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response;
		} catch (err: unknown) {
			const fetchError = err as FetchError;
			const errorStatus = fetchError.status || fetchError.statusCode;

			if (errorStatus === 401) {
				errorMessage.value = "Authorization failed. Please sign in again.";
			} else {
				errorMessage.value = "Failed to fetch orders. Please try again later.";
			}

			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	return {
		placeOrder,
		getUserOrders,
		isLoading,
		errorMessage,
	};
};
