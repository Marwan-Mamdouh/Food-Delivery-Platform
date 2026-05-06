# Layouts Documentation

Layouts in the web application provide a consistent structure across multiple pages.

## Default Layout (`default.vue`)
The default layout provides the standard shell for the application, including the navigation bar, main content slot, and footer.

### Functionality
- **Navigation:** Contains responsive top-level navigation (desktop and mobile) with links to Home, Menu, and Orders.
- **Cart Integration:** Shows the item count from the `useCart` composable.
- **Auth Integration:** Displays user authentication state (Sign In / Sign Out) using Supabase hooks.

### Usage
This layout is automatically applied by Nuxt as the `default` layout. To ensure it wraps a page, create your page files under `pages/` and they will be rendered inside the `<slot />`.

### Potential Issues & Errors
- **Hydration Mismatches:** Ensure that any client-specific state (like `useSupabaseUser`) is handled carefully if you see hydration warnings during SSR.
- **Menu State:** Mobile menu state is managed locally via `isMobileMenuOpen`. If navigation links don't close the menu, update the `NuxtLink` components to handle click events or state resets.
