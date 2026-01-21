# AGENTS.md

This document provides guidance for AI agents working on this project.

## Project Overview

Next.js 16 fullstack starter with authentication (Better Auth), database (Drizzle ORM + PostgreSQL), and type-safe environment variables (@t3-oss/env-nextjs).

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (email/password + username)
- **Styling**: Tailwind CSS v4 + Radix UI + shadcn/ui
- **Validation**: Valibot + Zod (for env vars)
- **Package Manager**: Bun

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run start    # Start production server
bun run lint     # Run ESLint
bun run db:migrate    # Apply DB migrations
bun run db:generate   # Generate new migration
bun run db:studio     # Open Drizzle Studio
```

## Package Management

Always use `bun` for package operations (install, add, remove, update). Never use `npm` or `pnpm`.

```bash
bun install              # Install all dependencies
bun add <package>        # Add a dependency
bun add -D <package>     # Add a dev dependency
bun remove <package>     # Remove a dependency
bun update <package>     # Update a dependency
```

## Key Files

| File                 | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `lib/env.ts`         | Type-safe env vars (use `env.VAR` not `process.env`) |
| `db/schema.ts`       | Drizzle schema definitions                           |
| `db/index.ts`        | DB connection using `env.DATABASE_URL`               |
| `drizzle.config.ts`  | Drizzle Kit config                                   |
| `lib/auth.ts`        | Better Auth configuration                            |
| `lib/auth-client.ts` | Client-side auth client                              |
| `features/auth/`     | Login/Register forms with Valibot schemas            |

## Environment Variables

Define in `.env.local` or `.env*` files:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Access via `env.DATABASE_URL`, `env.BETTER_AUTH_SECRET`, `env.NEXT_PUBLIC_API_URL` (from `lib/env.ts`).

## Architecture

### Feature-Based Organization

This project uses a **feature-based architecture** where related code is grouped by domain:

```
features/
├── auth/
│   ├── components/        # Auth-specific UI components
│   ├── login-form.tsx     # Login form component
│   ├── register-form.tsx  # Registration form
│   └── schema.ts          # Valibot validation schemas
├── admin/
│   ├── components/        # Admin-specific components
│   ├── home/              # Admin dashboard components
│   └── schema.ts          # Admin validation schemas
├── dashboard/
│   └── components/        # Dashboard components
└── profile/
    └── components/        # Profile management components
```

**Key Principles:**

- Each feature directory contains ALL related code (components, schemas, utils, types)
- Server actions live in `app/actions/` organized by feature (auth.ts, admin.ts, profile.ts)
- Shared/generic UI components go in `components/ui/`
- Feature-specific components stay in `features/{feature}/components/`

### When Adding New Features

1. Create `features/{feature-name}/` directory
2. Add feature components in `features/{feature-name}/components/`
3. Add validation schemas in `features/{feature-name}/schema.ts`
4. Add server actions in `app/actions/{feature-name}.ts`
5. Add routes in `app/{feature-name}/`

## Code Conventions

- **Imports**: Use `@/` alias for absolute imports
- **Naming**: PascalCase components, camelCase utilities, kebab-case files
- **Env Vars**: Always use `env.VAR` from `@/lib/env`, never `process.env` directly
- **Validation**: Forms use Valibot (schemas in `features/{feature}/schema.ts`)
- **Server Actions**: Organized by feature in `app/actions/{feature}.ts`
- **Feature Isolation**: Keep feature-specific code in `features/` directory

## Database

Schema in `db/schema.ts` (users, sessions, accounts, verifications tables). Run `npx drizzle-kit generate` after schema changes, then `npx drizzle-kit migrate` to apply.

## Server Actions & API Routes

### Server Actions (Preferred)

Server actions are organized by feature in `app/actions/`:

- `app/actions/auth.ts` - Authentication operations (login, register)
- `app/actions/admin.ts` - Admin operations (user management, stats)
- `app/actions/profile.ts` - Profile management
- `app/actions/user-management.ts` - User CRUD operations
- `app/actions/sign-out.ts` - Sign out action

### API Routes

- `app/api/auth/[...all]/route.ts` - Better Auth catchall handler

**Prefer server actions over API routes** for mutations and data fetching in Server Components.

## UI Components

### Generic UI Components (`components/ui/`)

Reusable, framework-agnostic components built with Radix UI + Tailwind CSS:

- Form controls: button, input, select, checkbox, textarea
- Layout: card, dialog, sheet, drawer, separator
- Data display: table, badge, avatar, skeleton
- Navigation: breadcrumb, pagination, sidebar
- Feedback: alert-dialog, sonner (toast), spinner

### Feature-Specific Components (`features/{feature}/components/`)

Components tied to specific business logic:

- `features/auth/components/` - Sign out button
- `features/admin/components/` - User table, filters, forms, role badges
- `features/dashboard/components/` - Dashboard nav, stats, quick actions
- `features/profile/components/` - Profile form, password form

**Rule**: If a component is reusable across features → `components/ui/`. If it contains feature-specific logic → `features/{feature}/components/`.

## Adding UI Components

Always use **shadcn CLI** to add new UI components. Never manually copy/create components.

```bash
bunx --bun shadcn@latest add alert        # Add alert component
bunx --bun shadcn@latest add button       # Add button component
bunx --bun shadcn@latest add dialog       # Add dialog component
bunx --bun shadcn@latest add table        # Add table component
```

This ensures components are properly configured with Tailwind CSS, Radix UI primitives, and follow the project's design system.

## Adding New Features

Follow this checklist when adding a new feature:

1. **Create feature directory**: `features/{feature-name}/`
2. **Add components**: `features/{feature-name}/components/` for feature-specific UI
3. **Add validation**: `features/{feature-name}/schema.ts` using Valibot
4. **Add server actions**: `app/actions/{feature-name}.ts` for mutations/queries
5. **Add routes**: `app/{feature-name}/page.tsx` and related route files
6. **Database changes** (if needed):
   - Update `db/schema.ts`
   - Run `npx drizzle-kit generate`
   - Run `npx drizzle-kit migrate`
7. **Add UI components**: Use shadcn CLI for generic components: `bunx --bun shadcn@latest add <component>`
8. **Environment variables** (if needed): Add to `lib/env.ts` with Zod validation
9. **Audit logging** (if needed): Use `lib/audit.ts` for tracking changes

### Example: Adding a "Notifications" Feature

```bash
# 1. Create feature structure
mkdir -p features/notifications/components

# 2. Add generic UI components
bunx --bun shadcn@latest add bell

# 3. Create files
touch features/notifications/schema.ts
touch features/notifications/components/notification-list.tsx
touch app/actions/notifications.ts
touch app/notifications/page.tsx

# 4. Update database schema
# Edit db/schema.ts, then:
npx drizzle-kit generate
npx drizzle-kit migrate
```
