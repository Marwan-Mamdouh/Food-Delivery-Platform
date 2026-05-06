# Frontend Application (Nuxt 4)

The user-facing web application for the Food Delivery Platform, built with Nuxt 4 and Tailwind CSS.

## 🏛 Architecture & Folder Structure

The frontend leverages the Nuxt 4 "app" directory pattern for modern, file-based routing and auto-import features.

```text
apps/web/
├── app/
│   ├── assets/             # Global CSS, images, and fonts
│   ├── components/         # Reusable Vue components
│   ├── composables/        # Shared reactive logic (e.g., useCart)
│   ├── layouts/            # Page templates (Default, etc.)
│   └── pages/              # File-based routing (Index, Menu, Cart)
├── nuxt.config.ts          # Nuxt framework configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- Backend API running (for full functionality)

### Installation
From the project root:
```bash
pnpm install
```

### Running the App
```bash
# Development mode with HMR
pnpm --filter web dev

# Production build (Static or SSR)
pnpm --filter web build

# Preview production build
pnpm --filter web preview
```

## 🛠 Core Technologies
- **Nuxt 4:** Hybrid Vue.js framework for SSR, SSG, and more.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Supabase Auth:** Client-side authentication hooks.
- **TypeScript:** Type-safe application development.

## 📖 Feature Documentation
For detailed information on specific components or logic, refer to:
- [Components & UI](./app/components/README.md)
- [Layouts & Structure](./app/layouts/README.md)
- [Composables & Logic](./app/composables/README.md)
- [Pages & Routing](./app/pages/README.md)
