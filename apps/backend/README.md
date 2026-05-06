# Backend Application (NestJS)

This is the core API for the Food Delivery Platform, built with NestJS and Prisma ORM. It handles business logic, database management, and authentication.

## 🏛 Architecture & Folder Structure

The backend follows a modular NestJS architecture for high maintainability and scalability.

```text
apps/backend/
├── src/
│   ├── common/             # Shared filters, guards, decorators, and DTOs
│   ├── config/             # Configuration modules (Database, Supabase)
│   ├── modules/            # Business logic domains (Auth, Menu, Order, etc.)
│   │   ├── [module]/       # Individual modules (see module-specific READMEs)
│   ├── app.module.ts       # Root module of the application
│   └── main.ts             # Entry point (Bootstrap)
├── test/                   # End-to-end (e2e) tests
├── nest-cli.json           # Nest CLI configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- A running PostgreSQL database (managed via Prisma)

### Installation
From the project root:
```bash
pnpm install
```

### Running the App
```bash
# Development mode with hot-reload
pnpm --filter backend dev

# Production build
pnpm --filter backend build

# Start production server
pnpm --filter backend start
```

## 🛠 Core Technologies
- **NestJS:** Progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **Prisma:** Modern database toolkit for TypeScript and Node.js.
- **Passport/Supabase:** Secure authentication and JWT validation.
- **PostgreSQL:** Primary relational database.

## 📖 Module Documentation
For detailed information on specific domains, please refer to the README files within each module folder:
- [Auth Module](./src/modules/auth/README.md)
- [Menu Module](./src/modules/menu/README.md)
- [Order Module](./src/modules/order/README.md)
- [Prisma Module](./src/modules/prisma/README.md)
- [Restaurant Module](./src/modules/restaurant/README.md)
