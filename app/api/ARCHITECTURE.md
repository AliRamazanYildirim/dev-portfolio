# API Domain Architecture Standard

> **Gültig ab:** 21.02.2026 — Alle neuen und bestehenden Domains MÜSSEN diesem Standard folgen.

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

`service.ts` liegt IMMER direkt im Domain-Ordner, NICHT in `lib/`. Die `lib/`-Ordner enthalten nur interne Implementierungsdetails.

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
