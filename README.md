# FoodieFlow - Professional Food Delivery Platform

FoodieFlow is a modern, scalable, and modular food delivery ecosystem built with a focus on architectural integrity and developer experience. This project demonstrates a robust implementation of a simplified food delivery web platform, connecting restaurants with customers through a seamless, authenticated API.

## 🚀 Architectural Overview

The project is structured as a **Monorepo** using `pnpm` workspaces, ensuring clean separation of concerns between business logic, database management, and shared resources.

### Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) (TypeScript) - Leveraging Dependency Injection and a modular architecture.
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) - Type-safe database queries and automated migrations.
- **Authentication:** [Supabase Auth](https://supabase.com/auth) with Passport.js JWT strategy.
- **Infrastructure:** Monorepo management via [pnpm](https://pnpm.io/).

---

## 🏗️ Project Structure

```text
├── apps/
│   ├── backend/          # NestJS Core API
│   └── frontend/         # (Placeholder for UI)
├── packages/
│   └── db/               # Shared Database Schema (Prisma)
├── pnpm-workspace.yaml   # Monorepo Workspace Configuration
└── tsconfig.base.json    # Shared TypeScript Configuration
```

### Key Modules (Backend)
- **Auth:** Secured via Supabase JWT validation. Extracts user identities directly from the Supabase ecosystem.
- **Restaurant:** Management of restaurant profiles and availability.
- **Menu & Menu Items:** Granular control over restaurant offerings, categories, pricing, and stock.
- **Order:** Complex state-machine-driven order processing (Pending -> Confirmed -> Preparing -> Out for Delivery -> Completed).

---

## 🛠️ Feature Highlights

- **Type Safety:** End-to-end TypeScript implementation ensures compile-time safety from the database layer to the API response.
- **Modular Design:** Each domain (Auth, Order, Restaurant) is encapsulated in its own NestJS module, making the codebase easy to maintain and scale.
- **Secure by Design:** All sensitive endpoints are protected by custom JWT Guards, validating tokens issued by Supabase.
- **Database Integrity:** Relational schema with strict foreign key constraints, cascading deletes for menu items, and indexed lookups for performance.
- **Global Error Handling:** Integrated Prisma Exception Filters to transform database errors into user-friendly HTTP responses.

---

## 🚥 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- pnpm (v9+)
- A PostgreSQL instance (Local or Cloud)
- Supabase Project (for Authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Food-Delivery-Platform.git
   cd Food-Delivery-Platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in `apps/backend/` and `packages/db/`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"
   SUPABASE_JWT_SECRET="your_supabase_jwt_secret"
   ```

4. **Initialize the Database:**
   ```bash
   pnpm run db:generate
   pnpm run db:push
   ```

5. **Run the Application:**
   ```bash
   pnpm run dev
   ```

---

## 📈 Future Roadmap
- [ ] **Frontend Implementation:** A React/Next.js dashboard for restaurants and a customer-facing portal.
- [ ] **Real-time Updates:** Integrating WebSockets for live order tracking.
- [ ] **Payment Integration:** Connecting Stripe or PayPal for secure transactions.
- [ ] **Driver Module:** A dedicated workflow for delivery partners.

---

## 📄 License
This project is [UNLICENSED](LICENSE).
