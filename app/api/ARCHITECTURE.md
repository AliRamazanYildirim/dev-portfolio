# API Domain Architecture Standard

> **Gültig ab:** 21.02.2026 — Alle neuen und bestehenden Domains MÜSSEN diesem Standard folgen.
> **Zuletzt aktualisiert:** Phase-5-Standardisierung (Subroute-Template-Harmonisierung, Facade-Konsistenz 100%, Update-Validierung, Service-Layer-Bereinigung)

## Offizielle Ordner-Vorlage

Jede Domain unter `app/api/` folgt diesem einheitlichen Aufbau:

```text
domain/
├── route.ts           # HTTP-Handler (nur Request/Response-Parsing)
├── service.ts         # Orchestrierungs-Fassade (Business-Logic-Einstiegspunkt)
├── types.ts           # Domain-Types & Interfaces (Request/Response DTOs)
├── validation.ts      # Input-Validierung (reine Funktionen)
└── lib/               # Interne Implementierungsdetails
    ├── dto.ts         # Data Transfer Objects + Mapper (falls benötigt)
    ├── *UseCase.ts    # Einzelne Use-Cases (SRP, bei komplexen Flows)
    ├── *Policy.ts     # Geschäftsregeln / Eligibility-Checks (OCP)
    ├── *Adapter.ts    # Template-/externe Adapter (DIP)
    ├── *Service.ts    # Domain-spezifische Sub-Services
    └── ...            # Weitere interne Helfer
```

### Facade-Pattern für Domains mit `lib/`-Tiefe

Wenn die Haupt-Implementierung in `lib/` liegt, verwenden `service.ts`, `types.ts` und
`validation.ts` am Domain-Root **Re-Export-Facades**:

```ts
// types.ts (Root)
export * from "./lib/types";

// validation.ts (Root)
export * from "./lib/validation";

// service.ts (Root)
export { MyService } from "./lib/service";
```

**Regel:** Externe Consumer importieren IMMER vom Domain-Root, nie direkt aus `lib/`.

### Cross-Domain-Imports

Wenn Domain A Typen/Funktionen von Domain B benötigt:

```ts
// ✅ Richtig – Import vom Domain-Root
import { CustomerReadDto, toCustomerReadDto } from "@/app/api/admin/customers/types";
import { calcDiscountedPrice } from "@/app/api/admin/customers/types";

// ❌ Falsch – Direkter lib/-Zugriff
import { toCustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import { calcDiscountedPrice } from "@/app/api/admin/customers/lib/referral";
```

**Regel:** `lib/` ist privat. Nur der Domain-Root (`types.ts`, `service.ts`) exponiert die öffentliche API.

Auch **domain-interne** `route.ts`-Dateien importieren über Root-Facades, nie direkt aus `lib/`:

```ts
// ✅ route.ts → Root-Facade
import { MyService } from "./service";
import { validateInput } from "./validation";
import { rateLimitHelper } from "./utils";

// ❌ route.ts → lib/ direkt
import { MyService } from "./lib/service";
import { validateInput } from "./lib/validation";
```

## Schichten & Verantwortlichkeiten

| Schicht | Datei(en) | Verantwortung | Darf importieren von |
| --- | --- | --- | --- |
| **Route** | `route.ts` | HTTP Parsing, Validation aufrufen, Response | service, validation, types |
| **Service** | `service.ts` | Orchestrierung, Fassade | lib/\*, types, @/lib/\* |
| **Validation** | `validation.ts` | Input-Validierung (reine Funktionen) | types, @/lib/validation |
| **Types** | `types.ts` | Interfaces, Type-Aliases, Enums | — |
| **Use-Case** | `lib/*UseCase.ts` | Ein einzelner Geschäfts-Flow (SRP) | lib/\*, @/lib/\* |
| **Policy** | `lib/*Policy.ts` | Geschäftsregeln, Eligibility (Pure, OCP) | types, dto |
| **DTO** | `lib/dto.ts` | Typ-sichere Mapper (Model → DTO) | @/models/\*, types |
| **Adapter** | `lib/*Adapter.ts` | Externe Abhängigkeiten hinter Port/Interface | lib/\*, @/lib/\* |

## Regeln

### 1. Route-Handler: Nur HTTP

```ts
// ✅ Richtig
export async function POST(req: Request) {
  const body = await req.json();
  const validation = validateInput(body);
  if (!validation.valid) throw new ValidationError(validation.error);
  const result = await MyService.execute(validation.value);
  return successResponse(result);
}

// ❌ Falsch — Geschäftslogik im Route-Handler
export async function POST(req: Request) {
  const body = await req.json();
  await connectToMongo();
  const doc = await MyModel.findOne({ ... });
  // ...
}
```

### 2. Cross-Cutting IMMER über `@/lib/`

| Concern          | Import                        |
| ---------------- | ----------------------------- |
| Response-Helpers | `@/lib/api-response`          |
| Fehler           | `@/lib/errors`                |
| Validation       | `@/lib/validation`            |
| Mail             | `@/lib/mail`                  |
| Notifications    | `@/lib/notifications`         |
| Repositories     | `@/lib/repositories`          |
| DB-Verbindung    | `@/lib/mongodb`               |

**Keine domain-lokalen Response-/Error-Helfer.** Verwende ausschließlich `successResponse`, `errorResponse`, `handleError` aus `@/lib/api-response`.

### 3. Service am Domain-Root

`service.ts` liegt IMMER direkt im Domain-Ordner, NICHT in `lib/`. Bei Domains mit `lib/`-Tiefe
kann `service.ts` ein Re-Export-Facade sein (siehe Facade-Pattern oben).

**Ausnahme:** Shared Services ohne eigene Route (z.B. `admin/auth/`) dienen als Domain-Service
für mehrere Route-Handler (z.B. `admin/login/`, `admin/session/`, `admin/logout/`).

### 3a. Erlaubte Inline-Response-Konstruktion

In **seltenen** Fällen darf der Route-Handler die Response manuell konstruieren:

- **Cookie-Setting:** `admin/login/` und `admin/logout/` setzen Cookies auf `NextResponse.json(...)` → `successResponse` kann keine Cookies setzen
- **Binary Response:** `invoice/generate/` gibt `new NextResponse(pdfBytes, ...)` zurück → kein JSON

In diesen Fällen MUSS trotzdem `handleError` für den Catch-Block verwendet werden.

### 3b. Keine duplizierte Validierung im Service

Wenn `validation.ts` Input-Felder prüft, darf `service.ts` dieselben Checks **nicht** wiederholen.
Der Service darf nur **Business-Validierung** durchführen (z.B. Slug-Eindeutigkeit, Existenz-Prüfung).

### 4. Typed Result Union für Policy-Ergebnisse

```ts
// ✅ Discriminated Union
type PolicyResult =
  | { shouldApply: true; data: ValidData }
  | { shouldApply: false; reason: string };

// ❌ Boolean + separate Daten
function checkPolicy(): boolean { ... }
```

### 5. DIP für externe Abhängigkeiten

Template-Builder, Mailer, Notifier werden über Interfaces injiziert:

```ts
// Port (Interface)
export interface ITemplateBuilder {
  build(params: BuildParams): { html: string; subject: string };
}

// Adapter (Implementierung)
export class DefaultTemplateBuilder implements ITemplateBuilder { ... }

// Factory
export function getTemplateBuilder(): ITemplateBuilder {
  return new DefaultTemplateBuilder();
}
```

## Wann welche Tiefe?

| Domain-Komplexität | Pflicht-Dateien | Optional (lib/) |
| --- | --- | --- |
| **Einfach** | route.ts, service.ts, types.ts | — |
| **Mittel** | route.ts, service.ts, types.ts, validation.ts | lib/dto.ts |
| **Komplex** | Alle Pflicht + lib/ mit Use-Cases | Policy, Adapter, Sub-Services |

## SOLID-Mapping

| Prinzip | Umsetzung im Template |
| --- | --- |
| **SRP** | Jede Datei hat eine Verantwortung: Route ≠ Service ≠ Validation ≠ Use-Case |
| **OCP** | Neue Regeln in Policy-Dateien, ohne bestehende Use-Cases zu ändern |
| **LSP** | Typed Result Unions statt Exceptions für erwartbare Ergebnisse |
| **ISP** | Kleine, fokussierte Interfaces (ITemplateBuilder, INotifier, etc.) |
| **DIP** | Service hängt von Ports (Interfaces) ab, nicht von konkreten Implementierungen |

## Domain-Compliance-Status

| Domain | route | service | types | validation | lib/ | api-response | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| admin/customers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **GOLD** |
| admin/discounts | Sub | ✅ | ✅ | ✅ | ✅ | ✅ | **GOLD** |
| admin/projects | Sub | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| admin/auth | — | ✅ | ✅ | — | — | — | Shared |
| admin/login | ✅ | ✅ (→auth) | ✅ | ✅ | — | ✅* | **GOLD** |
| admin/logout | ✅ | ✅ (→auth) | ✅ | ✅ | — | ✅* | **GOLD** |
| admin/session | ✅ | ✅ (→auth) | ✅ | ✅ | — | ✅ | **GOLD** |
| admin/settings/discounts | ✅ | ✅ | ✅ | ✅ | — | ✅ | **GOLD** |
| contact | ✅ | 🔄 | 🔄 | 🔄 | ✅ | ✅ | ✅ |
| discounts | ✅ | 🔄 | 🔄 | 🔄 | ✅ | ✅ | ✅ |
| invoice/generate | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |
| invoice/send-email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **GOLD** |
| project-status-email | ✅ | ✅ | 🔄 | ✅ | ✅ | ✅ | ✅ |
| projects | ✅ | 🔄 | 🔄 | 🔄 | ✅ | ✅ | ✅ |
| referral/send-email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **GOLD** |
| referral/validate | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| send-email | ✅ | 🔄 | 🔄 | 🔄 | ✅ | ✅ | ✅ |
| upload | ✅ | ✅ | ✅ | ✅ | — | ✅ | **GOLD** |

**Legende:** ✅ = direkt vorhanden, 🔄 = Root-Facade (re-export aus lib/), Sub = nur Sub-Routen,
✅ (→auth) = lokale Service-Facade delegiert an admin/auth, ✅* = erlaubte Inline-Response (Cookie/Binary), — = nicht benötigt
