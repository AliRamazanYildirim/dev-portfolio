# Naming and Structure Conventions

This document is the sole reference for naming and folder organization in this project, which is based on the Next.js App Router.

## 1) Chosen Standard

- Route segments: `kebab-case`
- Component files: `PascalCase`
- Hook files: `useX` (`camelCase`)
- Service/Helper files: `camelCase` (no dot; `*.service.ts` is not used)
- Folders under App that are not routes: `_components`, `_hooks`, `_services`, `_lib` (strategy for private folders)

## 2) Rules for the Next.js App Router

- Prescribed special filenames are not changed: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`
- For route groups, only the format `(group)` is used
- Dynamic segments: `[id]`, `[...slug]`, `[[...slug]]`
- Parallel routes: `@slot`
- Intercepting routes: `(.)`, `(..)`

## 3) UI Feature Folder Strategy

Within each feature, roles are clearly separated:

- `services/`: Calls to external systems or APIs
- `_lib/`: Feature-specific pure helpers (formatting, mapping, calculations)  
- `types.ts` or `types/`: Type definitions  

Decision rule:  

- Small module: `types.ts`  
- Large module: `types/` + `types/index.ts`  

Note: For new features, purpose-oriented names are preferred over `utils.ts` (e.g., `format.ts`, `mapper.ts`, `guards.ts`).  

## 4) Routing Language Policy  

The project accepts English as the primary standard for routing language.  

Exception:  

- The segment `impressum` is a deliberate and permanent exception as a legal page (due to DACH expectations).  

Thus, the existing combination (`/privacy`, `/terms`, `/impressum`) is a supported deliberate policy; automatic renaming will not occur.  

## 5) Constant Naming Policy  

The distinction should be clear:  

- Technical constants: `UPPER_SNAKE_CASE` (e.g., timeout, limit, static flags)  
- Content dictionaries / translation objects: `camelCase` (e.g., `translations`, `heroTranslations`)

Rules:

- Technical constants and content mappings are not kept in the same file.
- If technical constants are required, they are stored in a separate file/section.

## 6) Use of Barrel Export (`index.ts`)

`index.ts` is only used in the following cases:

- In layers requiring a shared access level like `lib/*`
- To clarify import ergonomics and the boundaries of the public API

Cases where it should not be used:

- Small/single-file feature folders
- Local modules that increase the risk of circular imports

## 7) Safe renaming procedure

1. Rename the file first
2. Update all import paths
3. `bun run build`
4. `bun run lint`
5. Smoke test on critical routes

Critical routes:

- `/admin/login`
- `/admin/discounts`
- `/projects`
- `/projects/[slug]`
