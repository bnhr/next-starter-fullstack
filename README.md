# Next.js Fullstack Starter

A modern, fullstack starter template featuring Next.js 16, Better Auth, Drizzle ORM, and type-safe environment variables.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (email/password + username)
- **Styling**: Tailwind CSS v4 + Radix UI + shadcn/ui
- **Validation**: Valibot + Zod
- **Package Manager**: Bun

## Getting Started

```bash
git clone https://github.com/bnhr/next-fullstack-starter.git
cd next-fullstack-starter
bun install
cp .env.example .env.local
# Edit .env.local with your database URL and auth secret
bun run db:migrate
bun dev
```

**Note**: This starter includes advanced features like audit logging and user management.

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Type-safe access via `env.VARIABLE_NAME` from `@/lib/env`.

## Scripts

```bash
bun dev              # Start dev server
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run db:migrate   # Apply migrations
bun run db:generate  # Generate migration
bun run db:studio    # Open Drizzle Studio
bun run db:seed      # Seed database
```

## Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Linting with Next.js config and Prettier integration
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters/formatters on staged files only

Pre-commit hooks automatically format and lint code before commits.

## Dependency Management

- **Renovate**: Automated dependency updates (runs every weekend)
- **Bun**: Fast package manager for all operations

## Project Structure

```
├── app/              # App Router pages & API
│   ├── actions/      # Server actions
│   └── api/auth/     # Auth endpoints
├── components/ui/    # shadcn/ui components
├── db/               # Schema & connection
├── features/auth/    # Auth forms & schemas
├── lib/              # Auth, env, utils
└── drizzle/          # Migrations
```

## Database

Schema in `db/schema.ts`. After changes:

```bash
bun run db:generate && bun run db:migrate
```

## Key Files

| Path             | Purpose              |
| ---------------- | -------------------- |
| `lib/env.ts`     | Type-safe env vars   |
| `db/schema.ts`   | Drizzle schema       |
| `lib/auth.ts`    | Auth configuration   |
| `features/auth/` | Login/Register forms |

## Code Conventions

- Imports: `@/` alias for absolute imports
- Components: PascalCase files
- Env vars: Use `env.VAR` from `@/lib/env`
- Forms: Valibot validation
