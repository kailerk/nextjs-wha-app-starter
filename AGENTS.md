# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

To generate/sync the Prisma client after schema changes:

```bash
npx prisma generate
npx prisma db push
```

## Architecture

This is a Next.js e-commerce + course listing app using the **App Router** exclusively. Two route groups share one database and auth layer:

- `src/app/(front)/` — public-facing storefront (home, product, course, cart, about)
- `src/app/(auth)/` — login and signup pages
- `src/app/api/auth/[...all]/route.ts` — Better-auth catch-all API handler

### Authentication

[`src/lib/auth.ts`](src/lib/auth.ts) configures Better-auth on the server (email/password, MariaDB via Prisma adapter). [`src/lib/auth-client.ts`](src/lib/auth-client.ts) exports the client-side `authClient`. Server components call `auth.api.getSession({ headers: await headers() })`; client components use the `authClient` hook. The navbar (`src/components/navbar.tsx`) is a **server component** that resolves the session and conditionally renders login/logout UI.

### Database

Prisma with a MariaDB adapter. The generated client lives in `generated/prisma/` (not the default location). The singleton is in [`src/lib/prisma.ts`](src/lib/prisma.ts). Schema: `prisma/schema.prisma`. Key models: `User`, `Session`, `Account`, `Verification`, `categories`, `products`, `product_images`, `customers`, `orders`, `order_items`.

`DATABASE_URL` must point to a MySQL/MariaDB instance (see `.env`). Sample SQL and Docker setup are in `docs/`.

### External Data

Courses are fetched from an external REST API (`https://api.codingthailand.com/api/course`) via [`src/services/course-service.ts`](src/services/course-service.ts). Next.js remote image patterns are configured for `api.codingthailand.com` and `www.fffuel.co`.

### State Management

Cart state uses Zustand with localStorage persistence (`src/lib/cart-store.ts`, key: `skill-cart`). No global server state library — data fetching is done directly in server components via Prisma or `fetch`.

### UI Components

Tailwind CSS v4 (PostCSS plugin, not the v3 config file approach). shadcn/ui components live in `src/components/ui/`. Page-specific components are colocated under each route group's `components/` folder. Shared layout components (navbar, hero, logo, etc.) are in `src/components/`. Use the `cn()` utility from `src/lib/utils.ts` for conditional class merging.

Forms use react-hook-form + zod. Path alias `@/*` maps to `src/*`.

## Environment Variables

Required in `.env`:

- `DATABASE_URL` — MySQL connection string
- `BETTER_AUTH_SECRET` — secret key for Better-auth
- `BETTER_AUTH_URL` — base URL (e.g. `http://localhost:3000`)
