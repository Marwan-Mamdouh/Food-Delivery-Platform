# Pages Documentation

This directory contains the main views of the web application.

## Menu Page (`menu.vue`)

The Menu page displays categorized food items available for order.

### Functionality

- **Categorization:** Items are grouped by restaurant.
- **Cart Interaction:** Utilizes `useCart` to add items. Includes a validation mechanism that blocks adding items from different restaurants.
- **Feedback:** Displays a transient error toast if the user tries to add items from a different restaurant while the cart is not empty.

### Usage

This page is accessible at `/menu`. It uses an internal mock menu data set; in production, this should be replaced with an API call to the backend.

## Cart Page (`cart.vue`)

The Cart page allows users to review, adjust, and clear their selection before checkout.

### Functionality

- **Cart Management:** Displays a detailed list of items with current quantities and pricing.
- **Quantity Adjustments:** Offers buttons to increment/decrement item quantities.
- **Empty State:** Shows a friendly empty-state UI when no items are in the cart.
- **Order Summary:** Calculates subtotal, estimates shipping, and displays total price.

### Usage

This page is accessible at `/cart`. It relies heavily on `useCart` for all reactive state and management logic.

## Home Page (`index.vue`)

The landing page of the platform.

### Functionality

- **Value Proposition:** Clearly presents the platform's features and benefits.
- **Navigation:** Provides quick links to the menu or registration/login.

### Usage

The entry point of the application, accessible at `/`.

## Order Success Page (`order-success.vue`)

Displays confirmation after a successful order placement.

### Functionality

- **Confirmation:** Shows order status and summary details.
- **Navigation:** Provides a link back to the menu or home page.

### Usage

Accessible at `/order-success` following a successful checkout process.
