# 🍱 FoodieFlow - Enterprise Food Delivery Ecosystem

[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-red.svg)](LICENSE)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Nuxt](https://img.shields.io/badge/Frontend-Nuxt-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Prisma](https://img.shields.io/badge/Database-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/Monorepo-pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**FoodieFlow** is a sophisticated, full-stack food delivery platform engineered for scalability, maintainability, and exceptional developer experience. Built as a high-performance **Monorepo**, it demonstrates modern software engineering patterns including Domain-Driven Design (DDD) principles, end-to-end type safety, and a modular architecture.

---

## 🏗️ Architectural Excellence

This project isn't just a simple web app; it's a blueprint for a production-ready ecosystem.

-   **Monorepo Strategy:** Managed via `pnpm` workspaces, enabling seamless code sharing between the backend, frontend, and database layers while maintaining strict boundaries.
-   **Type-Safe Persistence:** Leveraging **Prisma ORM** with **PostgreSQL**, ensuring that every data interaction is validated at compile-time.
-   **Unified Identity Management:** Integrates **Supabase Auth** with a custom NestJS Passport strategy, providing enterprise-grade security with minimal friction.
-   **Modular NestJS Backend:** A highly decoupled API structure where each domain (Order, Menu, Restaurant) is an independent, testable module.
-   **Modern Frontend:** A reactive, SEO-friendly UI powered by **Nuxt 3** and styled with **Tailwind CSS**.

---

## 🛠️ Tech Stack & Tools

| Layer | Technology | Key Features |
| :--- | :--- | :--- |
| **Backend** | [NestJS](https://nestjs.com/) | Dependency Injection, Validation Pipes, Global Filters |
| **Frontend** | [Nuxt 3](https://nuxt.com/) | Vue 3, Nitro Server, SSR/SSG Capabilities |
| **Database** | [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | Type-safe Client, Auto-migrations, Relational Integrity |
| **Auth** | [Supabase](https://supabase.com/) | JWT-based Auth, OAuth Support, Secure Identity |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, Responsive Design, JIT Compiler |
| **Tooling** | [pnpm](https://pnpm.io/) | Fast, disk-efficient package management |

---

## 📂 Project Blueprint

```text
.
├── apps/
│   ├── backend/          # NestJS Core API (Business Logic, Auth, State Machine)
│   └── web/              # Nuxt 3 Client (Consumer & Restaurant Portal)
├── packages/
│   ├── db/               # Shared Data Layer (Prisma Schema, Migrations, Client)
│   └── shared/           # (Planned) Shared DTOs, Utils, and Constants
├── pnpm-workspace.yaml   # Monorepo configuration
└── tsconfig.base.json    # Standardized TypeScript rules
```

---

## 🌟 High-Level Features

### 🔐 Secure Authentication
Robust user management powered by Supabase. The backend validates JWTs from the Supabase ecosystem, ensuring that only authenticated users can place orders or manage menus.

### 🏪 Restaurant & Menu Management
A comprehensive system for restaurants to manage their digital storefront.
-   **Dynamic Menus:** Organize items by categories with real-time stock tracking.
-   **Relational Integrity:** Cascading deletes and strict foreign keys prevent orphaned data.

### 🛒 Advanced Order Workflow
A state-machine-driven order processing system that tracks the lifecycle of a meal:
`PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `COMPLETED`

### 🛡️ Production-Grade Reliability
-   **Global Validation:** Every API request is sanitized via `class-validator`.
-   **Error Handling:** Custom Prisma Exception Filters transform database errors into semantic HTTP responses.
-   **CORS & Security:** Pre-configured for cross-origin resource sharing with frontend applications.

---

## 🚥 Getting Started

### Prerequisites
-   **Node.js:** v20 or higher
-   **pnpm:** v9 or higher
-   **PostgreSQL:** A running instance (Local or Supabase)

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/Food-Delivery-Platform.git
    cd Food-Delivery-Platform
    ```

2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Configure `.env` files in `apps/backend/` and `packages/db/`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
    SUPABASE_JWT_SECRET="your_secret_here"
    ```

4.  **Database Synchronization:**
    ```bash
    pnpm run db:generate
    pnpm run db:push
    ```

5.  **Launch Development Environment:**
    ```bash
    pnpm run dev
    ```

---

## 📈 Future Roadmap
- [ ] **Real-time Order Tracking:** Integration with WebSockets/Socket.io.
- [ ] **Payment Gateway:** Stripe/PayPal integration for seamless checkouts.
- [ ] **Dashboard Analytics:** Visualizing sales and popular menu items for restaurants.
- [ ] **Mobile App:** Expo/React Native version sharing the same shared logic.

---

## 📄 License
This project is [UNLICENSED](LICENSE).
