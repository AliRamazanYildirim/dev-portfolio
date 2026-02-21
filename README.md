# Dev Portfolio

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Naming & Structure Conventions

### App Router & route segments

- Route segment names use **kebab-case**.
- Next.js special files keep required names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`.
- Dynamic segments follow Next.js defaults: `[id]`, `[...slug]`, `[[...slug]]`, route groups `(group)`, parallel `@slot`, intercepting `(.)`/`(..)`.

### UI feature folders (`app/**`)

- UI features use `services/` (API or side-effect calls) and `utils/` (pure helpers).
- In UI features, prefer `utils/` over `lib/` for helper code.
- API domains under `app/api/**` keep their own architecture in `app/api/ARCHITECTURE.md` (including `lib/` as internal layer).

### File naming

- Components: **PascalCase** (`ProjectCard.tsx`)
- Hooks: **useX** camelCase (`useProjects.ts`)
- Services/helpers: **camelCase** without dotted suffixes (`adminAuthService.ts`)

### Types placement rule

- Small modules: single `types.ts`
- Larger modules: `types/` directory + `types/index.ts` barrel

### Constants naming rule

- Technical/runtime constants: **UPPER_SNAKE_CASE** (example: `INVOICE_CONSTANTS`)
- Content dictionaries and translation maps: **camelCase** (example: `translations`, `heroTranslations`)

### URL language policy

- Product routes default to English slugs.
- Legal route exceptions may stay localized when intentional (current legacy exception: `/impressum`).
- New route additions must follow one explicit language choice and be documented in the PR description.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Conventions

- Naming & structure standardı: [docs/naming-and-structure.md](docs/naming-and-structure.md)
- API domain architecture standardı: [app/api/ARCHITECTURE.md](app/api/ARCHITECTURE.md)
