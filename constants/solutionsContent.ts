import type { SupportedLanguage } from "@/contexts/LanguageContext";

export type SolutionSlug =
  | "lead-generation-websites"
  | "performance-seo"
  | "online-shop-setup"
  | "content-management"
  | "analytics-insights"
  | "handover-training";

interface PricingPlan {
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface SolutionContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  benefits: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  pricing: {
    starter?: PricingPlan;
    professional?: PricingPlan;
    enterprise?: PricingPlan;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

const solutionDetailsEn = {
  "lead-generation-websites": {
    hero: {
      title: "Lead-generation websites that convert",
      subtitle:
        "Launch messaging, structure, and proof points that guide visitors toward a meaningful conversation with your team.",
      cta: "Plan your project",
    },
    benefits: [
      {
        title: "Conversion-first architecture",
        description:
          "Strategic page flows, bold CTAs, and follow-up hooks aligned with your funnel so every section works harder.",
        icon: "/icons/global.png",
      },
      {
        title: "Persuasive storytelling",
        description:
          "Customer proof, objections, and messaging hierarchy mapped into reusable blocks you can test and iterate.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Performance and reliability",
        description:
          "Server-side rendering, edge caching, and image optimisation keep load times under two seconds worldwide.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Our new site doubled qualified enquiries within the first month. Meetings now start with trust already in place.",
      author: "Lena Krämer",
      role: "Marketing Lead",
      company: "BrightRecruit",
    },
    pricing: {
      starter: {
        price: "2,500",
        duration: "2-3 weeks",
        description: "Focused landing experience ready to capture leads from day one.",
        features: [
          "5 key pages with conversion copy",
          "Responsive layouts & analytics setup",
          "Lead capture & CRM hand-off",
          "One revision round",
        ],
      },
      professional: {
        price: "4,500",
        duration: "3-4 weeks",
        description: "Complete website with conversion assets, automation, and scalable CMS.",
        features: [
          "10+ modular pages",
          "Messaging workshop & copywriting",
          "SEO fundamentals & schema setup",
          "Automated follow-up workflows",
        ],
        highlighted: true,
        badge: "Recommended",
      },
      enterprise: {
        price: "8,500",
        duration: "6-8 weeks",
        description: "Custom components, experiments, and revenue-focused integrations.",
        features: [
          "Personalised onboarding flows",
          "Advanced A/B testing setup",
          "Marketing automation integrations",
          "3 months optimisation support",
        ],
      },
    },
    cta: {
      title: "Ready to attract qualified leads?",
      subtitle:
        "Let’s align strategy, copy, and UX so your website becomes the most reliable closer in your pipeline.",
      button: "Book a discovery call",
    },
  },
  "performance-seo": {
    hero: {
      title: "Performance and SEO tuning for modern teams",
      subtitle:
        "Remove legacy bottlenecks, deliver lighthouse-perfect scores, and protect your rankings with technical clarity.",
      cta: "Schedule a review",
    },
    benefits: [
      {
        title: "Measured speed upgrades",
        description:
          "Deep audits of Core Web Vitals with focused refactors across scripts, images, fonts, and caching policies.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Technical SEO hygiene",
        description:
          "Structured data, sitemap health, redirects, and robots governance handled in one transparent backlog.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Continuous monitoring",
        description:
          "Automated checks and dashboards so regressions surface instantly and teams stay confident after every release.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "We went from a 58 to a 96 Lighthouse score and saw organic sessions grow by 42% within one quarter.",
      author: "Ethan Powell",
      role: "Head of Growth",
      company: "Nordic SaaS",
    },
    pricing: {
      starter: {
        price: "2,200",
        duration: "2 weeks",
        description: "Essential audit, quick wins, and implementation support for small sites.",
        features: [
          "Full performance & SEO audit",
          "Prioritised remediation plan",
          "Next.js build optimisation",
          "Implementation pairing session",
        ],
      },
      professional: {
        price: "4,100",
        duration: "3-4 weeks",
        description: "Comprehensive optimisation for content-heavy or international properties.",
        features: [
          "End-to-end optimisation",
          "Schema & localisation strategy",
          "CI monitoring hooks",
          "Training for internal teams",
        ],
        highlighted: true,
        badge: "Popular",
      },
      enterprise: {
        price: "7,900",
        duration: "5-7 weeks",
        description: "Ongoing partner support for complex architectures and multi-brand portfolios.",
        features: [
          "Edge & CDN fine-tuning",
          "Search Console & analytics automation",
          "Rollout playbooks for releases",
          "Quarterly improvement cycles",
        ],
      },
    },
    cta: {
      title: "Let’s make your site feel instant",
      subtitle:
        "Share your current stack and we will outline the exact optimisation roadmap with measurable checkpoints.",
      button: "Request the audit",
    },
  },
  "online-shop-setup": {
    hero: {
      title: "Launch a maintainable online shop",
      subtitle:
        "Build a conversion-ready storefront with inventory control, payments, and fulfilment that your team can run daily.",
      cta: "Start your store",
    },
    benefits: [
      {
        title: "E-commerce foundations",
        description:
          "Robust product catalogues, variant logic, and tax rules implemented for your preferred regions.",
        icon: "/icons/online-store.png",
      },
      {
        title: "Optimised buyer journeys",
        description:
          "High-performing product pages, bundles, and checkout flows tuned for mobile-first customers.",
        icon: "/icons/global.png",
      },
      {
        title: "Operations your team controls",
        description:
          "Training, documentation, and automated alerts so fulfilment stays smooth as volume grows.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "We launched in four weeks and processed our first 100 orders without a single support ticket.",
      author: "María López",
      role: "Founder",
      company: "Atelier No.3",
    },
    pricing: {
      starter: {
        price: "3,200",
        duration: "3-4 weeks",
        description: "Shopify or custom storefront ready with essential integrations and tracking.",
        features: [
          "Product catalogue setup",
          "Secure payments & invoicing",
          "Shipping zones & taxation",
          "Email receipts & analytics",
        ],
      },
      professional: {
        price: "5,800",
        duration: "4-6 weeks",
        description: "Advanced merchandising, automation, and CMS content for brand storytelling.",
        features: [
          "Bundle & subscription flows",
          "Headless CMS integration",
          "Marketing automations",
          "A/B tested landing templates",
        ],
        highlighted: true,
        badge: "Best Value",
      },
      enterprise: {
        price: "9,500",
        duration: "7-9 weeks",
        description: "Enterprise commerce workflows, ERP links, and multi-language expansion.",
        features: [
          "Custom integrations & APIs",
          "Warehouse and ERP sync",
          "Performance budget monitoring",
          "Growth experiments roadmap",
        ],
      },
    },
    cta: {
      title: "Ready to open your store?",
      subtitle:
        "Get an e-commerce setup that looks premium, loads fast, and gives your team the keys from day one.",
      button: "Plan the rollout",
    },
  },
  "content-management": {
    hero: {
      title: "Content management without the friction",
      subtitle:
        "Empower marketers to launch updates, campaigns, and translations in minutes without waiting on developers.",
      cta: "See the workflow",
    },
    benefits: [
      {
        title: "Component-driven CMS",
        description:
          "Reusable blocks, guardrails, and previews that keep layouts on-brand while giving editors full freedom.",
        icon: "/icons/browser.png",
      },
      {
        title: "Governed collaboration",
        description:
          "Roles, staging environments, and publishing checklists that make compliance teams comfortable.",
        icon: "/icons/global.png",
      },
      {
        title: "Rollout enablement",
        description:
          "Documentation, video walkthroughs, and office hours to build confidence across your organisation.",
        icon: "/icons/training.png",
      },
    ],
    testimonial: {
      quote: "Marketing now ships updates twice as fast and the brand team finally sleeps at night.",
      author: "Judith Steiner",
      role: "Chief Marketing Officer",
      company: "FlowCorp",
    },
    pricing: {
      starter: {
        price: "2,700",
        duration: "3 weeks",
        description: "Headless CMS setup with core models and publishing workflow for lean teams.",
        features: [
          "Content modelling workshop",
          "Component library integration",
          "Draft, review, publish stages",
          "Editor training session",
        ],
      },
      professional: {
        price: "4,600",
        duration: "4-5 weeks",
        description: "Enterprise-ready governance with localisation, asset automation, and QA tooling.",
        features: [
          "Multi-language workflows",
          "Asset optimisation pipeline",
          "Role-based access & audit logs",
          "Visual regression testing",
        ],
        highlighted: true,
        badge: "Team Favourite",
      },
      enterprise: {
        price: "7,600",
        duration: "6-8 weeks",
        description: "Global content operations with integrations into CRM, DAM, and analytics stacks.",
        features: [
          "CRM & marketing tool sync",
          "Personalisation experiments",
          "Change management playbook",
          "Quarterly optimisation reviews",
        ],
      },
    },
    cta: {
      title: "Give your team publishing superpowers",
      subtitle:
        "We will map your content model, build friendly tooling, and hand over a playbook that keeps things tidy.",
      button: "Design my CMS",
    },
  },
  "analytics-insights": {
    hero: {
      title: "Analytics that inform every decision",
      subtitle:
        "Track the metrics that matter, automate reporting, and surface insights that steer your next sprint.",
      cta: "Request the dashboard",
    },
    benefits: [
      {
        title: "North-star KPIs",
        description:
          "Alignment workshops and measurement plans focused on the metrics that move your business forward.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Reliable instrumentation",
        description:
          "Server events, consent-aware tracking, and privacy controls that make legal and data teams happy.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Insightful storytelling",
        description:
          "Dashboards, Loom walkthroughs, and action lists sent to stakeholders every sprint.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Instead of chasing manual spreadsheets we now ship growth experiments based on one shared source of truth.",
      author: "Claudia Meier",
      role: "Product Lead",
      company: "InsightOps",
    },
    pricing: {
      starter: {
        price: "1,900",
        duration: "2 weeks",
        description: "Analytics foundation with consent-aware tracking and weekly reporting templates.",
        features: [
          "KPI alignment workshop",
          "GA4 & server events setup",
          "Dashboard with core views",
          "Weekly insights template",
        ],
      },
      professional: {
        price: "3,900",
        duration: "3-4 weeks",
        description: "Advanced instrumentation across platforms with automated alerts and experimentation support.",
        features: [
          "Multi-channel attribution",
          "Automated reporting & alerts",
          "Experiment backlog & scoring",
          "Team enablement sessions",
        ],
        highlighted: true,
        badge: "Insights Pro",
      },
      enterprise: {
        price: "6,500",
        duration: "5-6 weeks",
        description: "Centralised analytics warehouse, reverse ETL, and executive narrative support.",
        features: [
          "Data warehouse connectors",
          "Reverse ETL into CRM",
          "Executive KPI narratives",
          "Quarterly optimisation cycles",
        ],
      },
    },
    cta: {
      title: "Confidence in every metric",
      subtitle:
        "Tell us what you are tracking today and we will design instrumentation that powers clear, confident decisions.",
      button: "Build my dashboards",
    },
  },
  "handover-training": {
    hero: {
      title: "Handover and training that sticks",
      subtitle:
        "Transform delivery into lasting momentum with documentation, playbooks, and ongoing support your team will love.",
      cta: "Plan the enablement",
    },
    benefits: [
      {
        title: "Structured knowledge base",
        description:
          "Step-by-step guides, videos, and runbooks that make onboarding and troubleshooting effortless.",
        icon: "/icons/browser.png",
      },
      {
        title: "Interactive team sessions",
        description:
          "Role-based workshops and Q&A clinics designed to build confidence fast across stakeholders.",
        icon: "/icons/training.png",
      },
      {
        title: "Post-launch partnership",
        description:
          "Slack hotline, retro meetings, and improvement sprints keep momentum after go-live.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "Our internal team felt supported from day one and now ships updates independently without breaking flow.",
      author: "Patrick Jones",
      role: "Operations Director",
      company: "FinSuite",
    },
    pricing: {
      starter: {
        price: "1,600",
        duration: "2 weeks",
        description: "Focused enablement for small teams that need confidence after launch.",
        features: [
          "Knowledge base creation",
          "Two live training sessions",
          "Recorded walkthrough library",
          "30-day Q&A support",
        ],
      },
      professional: {
        price: "3,200",
        duration: "3-4 weeks",
        description: "Full enablement programme with change management and adoption tracking.",
        features: [
          "Role-based training tracks",
          "Adoption scorecards",
          "Process automation guidance",
          "Roadmap co-creation",
        ],
        highlighted: true,
        badge: "Team Ready",
      },
      enterprise: {
        price: "5,400",
        duration: "5-6 weeks",
        description: "Long-term partnership with executive coaching, staffing plans, and quarterly refinements.",
        features: [
          "Executive enablement workshops",
          "Hiring & staffing guidance",
          "Quarterly maturity assessments",
          "Dedicated success manager",
        ],
      },
    },
    cta: {
      title: "Empower your team for the long run",
      subtitle:
        "Get documentation, coaching, and support that keeps improvements shipping well beyond the initial project.",
      button: "Schedule the training",
    },
  },
} satisfies Record<SolutionSlug, SolutionContent>;

const solutionDetailsDe = {
  "lead-generation-websites": {
    hero: {
      title: "Websites, die Leads liefern",
      subtitle:
        "Struktur, Messaging und Social Proof, die Besucher:innen gezielt zu einem Gespräch mit Ihrem Team führen.",
      cta: "Projekt planen",
    },
    benefits: [
      {
        title: "Conversion-orientierte Architektur",
        description:
          "Geordnete Seitenflüsse, klare CTAs und Follow-up-Hooks, damit jede Sektion messbar performt.",
        icon: "/icons/global.png",
      },
      {
        title: "Überzeugende Story",
        description:
          "Kund:innenstimmen, Einwände und Nutzenversprechen in wiederverwendbaren Blöcken – bereit für Tests.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Performance & Stabilität",
        description:
          "Server-Side-Rendering, Edge-Caching und optimierte Bilder für Ladezeiten unter zwei Sekunden.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Bereits im ersten Monat haben sich qualifizierte Anfragen verdoppelt. Gespräche starten jetzt mit Vertrauen.",
      author: "Lena Krämer",
      role: "Marketing Lead",
      company: "BrightRecruit",
    },
    pricing: {
      starter: {
        price: "2.500",
        duration: "2-3 Wochen",
        description: "Fokussierte Landing-Experience, die Leads ab dem ersten Tag einsammelt.",
        features: [
          "5 Kernseiten inkl. Conversion-Copy",
          "Responsive Layouts & Analytics",
          "Lead-Formulare & CRM-Übergabe",
          "Eine Feedback-Runde",
        ],
      },
      professional: {
        price: "4.500",
        duration: "3-4 Wochen",
        description: "Komplette Website mit Conversion-Assets, Automatisierung und skalierbarem CMS.",
        features: [
          "10+ modulare Seiten",
          "Messaging-Workshop & Copy",
          "SEO-Basics & Schema-Markup",
          "Automatisierte Follow-ups",
        ],
        highlighted: true,
        badge: "Empfohlen",
      },
      enterprise: {
        price: "8.500",
        duration: "6-8 Wochen",
        description: "Individuelle Komponenten, Experimente und Integrationen für Wachstum.",
        features: [
          "Personalisierte Onboarding-Flows",
          "A/B-Test-Setup",
          "Marketing-Automationen",
          "3 Monate Optimierungs-Support",
        ],
      },
    },
    cta: {
      title: "Bereit für qualifizierte Leads?",
      subtitle:
        "Wir richten Strategie, Copy und UX so aus, dass Ihre Website zum zuverlässigsten Vertriebskanal wird.",
      button: "Discovery Call buchen",
    },
  },
  "performance-seo": {
    hero: {
      title: "Performance- & SEO-Tuning für moderne Teams",
      subtitle:
        "Technische Altlasten entfernen, Lighthouse-Werte sichern und Rankings mit klarer Struktur schützen.",
      cta: "Audit anfragen",
    },
    benefits: [
      {
        title: "Messbare Speed-Gewinne",
        description:
          "Analyse der Core Web Vitals mit fokussierten Optimierungen bei Skripten, Bildern, Fonts und Caching.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Technisches SEO",
        description:
          "Strukturierte Daten, Sitemap-Qualität, Redirects und Robots-Regeln in einem transparenten Backlog.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Monitoring inklusive",
        description:
          "Automatisierte Checks und Dashboards, damit Regressionen sofort sichtbar werden – auch nach Releases.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Von Lighthouse 58 auf 96 und 42 % mehr organische Sessions – alles innerhalb eines Quartals.",
      author: "Ethan Powell",
      role: "Head of Growth",
      company: "Nordic SaaS",
    },
    pricing: {
      starter: {
        price: "2.200",
        duration: "2 Wochen",
        description: "Audit, Quick Wins und Support für kompakte Seiten.",
        features: [
          "Performance- & SEO-Audit",
          "Priorisierte Maßnahmen",
          "Next.js-Optimierung",
          "Implementierungs-Session",
        ],
      },
      professional: {
        price: "4.100",
        duration: "3-4 Wochen",
        description: "Ganzheitliche Optimierung für inhaltsstarke oder internationale Präsenzen.",
        features: [
          "End-to-End-Optimierung",
          "Schema & Lokalisierung",
          "CI-Monitoring-Hooks",
          "Team-Training",
        ],
        highlighted: true,
        badge: "Beliebt",
      },
      enterprise: {
        price: "7.900",
        duration: "5-7 Wochen",
        description: "Langfristiger Partner für komplexe Architekturen und Multi-Brand-Setups.",
        features: [
          "Edge- & CDN-Finetuning",
          "Search-Console-Automation",
          "Rollout-Playbooks",
          "Quarterly Reviews",
        ],
      },
    },
    cta: {
      title: "Ihre Seite soll sich sofort anfühlen",
      subtitle:
        "Wir analysieren Ihren Stack und liefern einen klaren Optimierungsfahrplan mit messbaren Meilensteinen.",
      button: "Audit sichern",
    },
  },
  "online-shop-setup": {
    hero: {
      title: "E-Commerce, den Ihr Team steuert",
      subtitle:
        "Ein Shop mit Conversion-Fokus, Bestandsverwaltung, Zahlungen und Fulfillment, den Sie täglich betreiben.",
      cta: "Shop starten",
    },
    benefits: [
      {
        title: "Saubere Shop-Basis",
        description:
          "Produktkataloge, Variantenlogik und Steuerregeln für Ihre Zielmärkte korrekt implementiert.",
        icon: "/icons/online-store.png",
      },
      {
        title: "Optimierte Kaufstrecken",
        description:
          "Performante Produktseiten, Bundles und Checkouts – optimiert für mobile Kund:innen.",
        icon: "/icons/global.png",
      },
      {
        title: "Prozesse im Griff",
        description:
          "Trainings, Dokumentation und Alerts, damit Lieferung und Service auch bei Wachstum stabil bleiben.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "Wir haben in vier Wochen gelauncht und die ersten 100 Bestellungen ohne Support-Tickets abgewickelt.",
      author: "María López",
      role: "Gründerin",
      company: "Atelier No.3",
    },
    pricing: {
      starter: {
        price: "3.200",
        duration: "3-4 Wochen",
        description: "Shopify oder Headless-Shop mit Kernintegrationen und Tracking.",
        features: [
          "Produktkatalog-Setup",
          "Sichere Zahlungen & Rechnungen",
          "Versandzonen & Steuern",
          "E-Mail-Quittungen & Analytics",
        ],
      },
      professional: {
        price: "5.800",
        duration: "4-6 Wochen",
        description: "Fortgeschrittenes Merchandising, Automatisierung und CMS für Storytelling.",
        features: [
          "Bundles & Subscriptions",
          "Headless-CMS-Anbindung",
          "Marketing-Automationen",
          "A/B-optimierte Templates",
        ],
        highlighted: true,
        badge: "Top Paket",
      },
      enterprise: {
        price: "9.500",
        duration: "7-9 Wochen",
        description: "Enterprise-Commerce mit ERP-Sync und Mehrsprachigkeit.",
        features: [
          "Individuelle Integrationen",
          "Lager- & ERP-Abgleich",
          "Performance-Monitoring",
          "Growth-Experiment-Plan",
        ],
      },
    },
    cta: {
      title: "Bereit für Ihren Shop?",
      subtitle:
        "Wir liefern ein E-Commerce-Setup, das edel aussieht, schnell lädt und Ihrem Team volle Kontrolle gibt.",
      button: "Rollout planen",
    },
  },
  "content-management": {
    hero: {
      title: "Content-Management ohne Reibung",
      subtitle:
        "Marketing veröffentlicht Kampagnen, Übersetzungen und Updates in Minuten – ganz ohne Entwickler-Wartezeit.",
      cta: "Workflow ansehen",
    },
    benefits: [
      {
        title: "Komponentenbasiertes CMS",
        description:
          "Wiederverwendbare Module mit Leitplanken und Previews halten Layouts on-brand und flexibel.",
        icon: "/icons/browser.png",
      },
      {
        title: "Governance inklusive",
        description:
          "Rollen, Staging-Umgebungen und Checklisten schaffen Sicherheit für Compliance und Brand-Team.",
        icon: "/icons/global.png",
      },
      {
        title: "Enablement & Support",
        description:
          "Dokumentation, Videos und Sprechstunden geben allen Abteilungen Zutrauen in den Prozess.",
        icon: "/icons/training.png",
      },
    ],
    testimonial: {
      quote: "Marketing veröffentlicht doppelt so schnell und das Brand-Team schläft endlich wieder ruhig.",
      author: "Judith Steiner",
      role: "CMO",
      company: "FlowCorp",
    },
    pricing: {
      starter: {
        price: "2.700",
        duration: "3 Wochen",
        description: "Headless-CMS mit Kernmodellen und Publishing-Workflow für kleinere Teams.",
        features: [
          "Content-Modeling-Workshop",
          "Komponenten-Bibliothek",
          "Draft/Review/Publish-Stufen",
          "Editor-Training",
        ],
      },
      professional: {
        price: "4.600",
        duration: "4-5 Wochen",
        description: "Enterprise-Governance mit Lokalisierung, Asset-Automation und QA-Tools.",
        features: [
          "Mehrsprachige Workflows",
          "Asset-Optimierung",
          "Rollen & Audit-Logs",
          "Visuelle Regressionstests",
        ],
        highlighted: true,
        badge: "Team-Liebling",
      },
      enterprise: {
        price: "7.600",
        duration: "6-8 Wochen",
        description: "Globaler Content-Betrieb mit CRM-, DAM- und Analytics-Integration.",
        features: [
          "CRM-/Marketing-Sync",
          "Personalisierungs-Tests",
          "Change-Management-Playbook",
          "Quartalsweise Optimierung",
        ],
      },
    },
    cta: {
      title: "Geben Sie Ihrem Team Publishing-Power",
      subtitle:
        "Wir entwerfen Ihr Content-Modell, bauen benutzerfreundliche Tools und übergeben ein klares Playbook.",
      button: "CMS designen",
    },
  },
  "analytics-insights": {
    hero: {
      title: "Analytics, die Entscheidungen steuern",
      subtitle:
        "Verfolgen Sie die wichtigen KPIs, automatisieren Sie Reporting und leiten Sie Maßnahmen für den nächsten Sprint ab.",
      cta: "Dashboard anfordern",
    },
    benefits: [
      {
        title: "Gemeinsame Zielgrößen",
        description:
          "Workshops und Messpläne, die sich auf Geschäftstreiber konzentrieren und Teams ausrichten.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Saubere Instrumentierung",
        description:
          "Server-Events, Consent-gerechtes Tracking und Privacy-Controls für Legal und Data Teams.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Storytelling mit Wirkung",
        description:
          "Dashboards, Loom-Walkthroughs und Maßnahmenlisten für Stakeholder in jedem Sprint.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Anstatt Tabellen zu pflegen, steuern wir jetzt Experimente über eine geteilte Datenbasis.",
      author: "Claudia Meier",
      role: "Product Lead",
      company: "InsightOps",
    },
    pricing: {
      starter: {
        price: "1.900",
        duration: "2 Wochen",
        description: "Analytics-Grundlage mit Consent-Tracking und Reporting-Templates.",
        features: [
          "KPI-Alignment",
          "GA4 & Server-Events",
          "Dashboard mit Kernansichten",
          "Weekly-Insights-Template",
        ],
      },
      professional: {
        price: "3.900",
        duration: "3-4 Wochen",
        description: "Erweiterte Instrumentierung mit Alerts und Experiment-Support.",
        features: [
          "Multi-Channel-Attribution",
          "Automatisierte Reports",
          "Experiment-Backlog",
          "Team-Enablement",
        ],
        highlighted: true,
        badge: "Insights Pro",
      },
      enterprise: {
        price: "6.500",
        duration: "5-6 Wochen",
        description: "Zentrales Analytics-Warehouse, Reverse ETL und Executive-Reporting.",
        features: [
          "Data-Warehouse-Anbindung",
          "Reverse ETL ins CRM",
          "Executive KPI Narratives",
          "Quartalsweise Optimierung",
        ],
      },
    },
    cta: {
      title: "Sicherheit in jedem KPI",
      subtitle:
        "Wir gestalten Ihre Instrumentierung so, dass Entscheidungen auf klaren Daten basieren – sprint für sprint.",
      button: "Dashboards bauen",
    },
  },
  "handover-training": {
    hero: {
      title: "Übergabe & Training mit Wirkung",
      subtitle:
        "Lieferung wird zur dauerhaften Dynamik – mit Dokumentation, Playbooks und Support, der hängen bleibt.",
      cta: "Enablement planen",
    },
    benefits: [
      {
        title: "Strukturierte Wissensbasis",
        description:
          "Guides, Videos und Runbooks, die Onboarding und Troubleshooting leicht machen.",
        icon: "/icons/browser.png",
      },
      {
        title: "Interaktive Sessions",
        description:
          "Rollenbasierte Workshops und Q&A-Formate, die innerhalb kürzester Zeit Sicherheit schaffen.",
        icon: "/icons/training.png",
      },
      {
        title: "Partnerschaft nach dem Launch",
        description:
          "Slack-Hotline, Retros und Verbesserungssprints halten das Tempo hoch.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "Unser Team fühlte sich von Tag eins an unterstützt und liefert Updates jetzt eigenständig aus.",
      author: "Patrick Jones",
      role: "Operations Director",
      company: "FinSuite",
    },
    pricing: {
      starter: {
        price: "1.600",
        duration: "2 Wochen",
        description: "Enablement-Paket für kleine Teams nach dem Launch.",
        features: [
          "Wissensbasis-Aufbau",
          "Zwei Live-Trainings",
          "Video-Library",
          "30 Tage Q&A",
        ],
      },
      professional: {
        price: "3.200",
        duration: "3-4 Wochen",
        description: "Komplettes Enablement mit Change Management und Adoption-Tracking.",
        features: [
          "Rollenbasierte Trainings",
          "Adoption-Scorecards",
          "Automations-Coaching",
          "Roadmap Co-Creation",
        ],
        highlighted: true,
        badge: "Team Ready",
      },
      enterprise: {
        price: "5.400",
        duration: "5-6 Wochen",
        description: "Langfristiger Partner mit Executive-Coaching, Staffing & Quartalsreviews.",
        features: [
          "Executive-Workshops",
          "Hiring- & Staffing-Guidance",
          "Quarterly Assessments",
          "Dedizierter Success Manager",
        ],
      },
    },
    cta: {
      title: "Machen Sie Ihr Team langfristig stark",
      subtitle:
        "Wir liefern Dokumentation, Coaching und Support, damit Verbesserungen auch nach dem Projekt weiterlaufen.",
      button: "Training buchen",
    },
  },
} satisfies Record<SolutionSlug, SolutionContent>;

const solutionDetailsTr = {
  "lead-generation-websites": {
    hero: {
      title: "Lead üreten web siteleri",
      subtitle:
        "Ziyaretçileri stratejik mesajlar ve kanıtlarla ekibinizle görüşmeye yönlendiren bir deneyim oluşturun.",
      cta: "Projeyi planla",
    },
    benefits: [
      {
        title: "Dönüşüm odaklı yapı",
        description:
          "Huniye uygun sayfa akışları, güçlü CTA'lar ve takip otomasyonları her bölümün daha çok çalışmasını sağlar.",
        icon: "/icons/global.png",
      },
      {
        title: "İkna edici hikâye",
        description:
          "Müşteri referansları, itiraz yanıtları ve mesajlaşma hiyerarşisi kolayca test edilebilen bloklara dönüştürülür.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Üstün performans",
        description:
          "Server-side render, edge caching ve görsel optimizasyonu ile sayfalarınız her yerde iki saniyenin altında açılır.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Yeni sitemiz ilk ayda nitelikli talepleri ikiye katladı. Görüşmeler artık güvenle başlıyor.",
      author: "Lena Krämer",
      role: "Pazarlama Lideri",
      company: "BrightRecruit",
    },
    pricing: {
      starter: {
        price: "2.500",
        duration: "2-3 hafta",
        description: "Lansman günü lead toplayan odaklı bir landing deneyimi.",
        features: [
          "Dönüşüm odaklı 5 sayfa",
          "Responsive layout ve analytics",
          "Lead formu & CRM entegrasyonu",
          "1 revizyon turu",
        ],
      },
      professional: {
        price: "4.500",
        duration: "3-4 hafta",
        description: "Conversion varlıkları, otomasyon ve ölçeklenebilir CMS ile tam site deneyimi.",
        features: [
          "10+ modüler sayfa",
          "Mesajlaşma atölyesi & metin",
          "SEO temelleri & schema setup",
          "Otomatik takip akışları",
        ],
        highlighted: true,
        badge: "Önerilen",
      },
      enterprise: {
        price: "8.500",
        duration: "6-8 hafta",
        description: "Özel bileşenler, deneyler ve gelir odaklı entegrasyonlar.",
        features: [
          "Kişiselleştirilmiş onboarding",
          "A/B test altyapısı",
          "Marketing automation entegrasyonu",
          "3 ay optimizasyon desteği",
        ],
      },
    },
    cta: {
      title: "Kaliteli lead'ler hazır",
      subtitle:
        "Strateji, metin ve UX'i hizalayarak web sitenizi en güvenilir satış kanalınıza dönüştürelim.",
      button: "Discovery görüşmesi al",
    },
  },
  "performance-seo": {
    hero: {
      title: "Performans ve SEO ayarı",
      subtitle:
        "Teknik borcu azaltın, Lighthouse skorlarını yükseltin ve arama görünürlüğünüzü sürdürülebilir kılın.",
      cta: "Değerlendirme iste",
    },
    benefits: [
      {
        title: "Ölçülebilir hız artışı",
        description:
          "Core Web Vitals analizi ve script, görsel, font, cache optimizasyonlarıyla doğrudan sonuç alın.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Teknik SEO düzeni",
        description:
          "Schema, sitemap sağlığı, yönlendirmeler ve robots kuralları tek backlog içinde şeffaf yönetilir.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Sürekli izleme",
        description:
          "Otomatik kontroller ve panolarla regresyonlar hemen görünür, sürümler sonrasında güven korunur.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "Lighthouse skorunu 58'den 96'ya çıkardık, organik trafik üç ayda %42 arttı.",
      author: "Ethan Powell",
      role: "Growth Müdürü",
      company: "Nordic SaaS",
    },
    pricing: {
      starter: {
        price: "2.200",
        duration: "2 hafta",
        description: "Küçük siteler için denetim, hızlı kazanımlar ve uygulama desteği.",
        features: [
          "Performans & SEO denetimi",
          "Öncelikli aksiyon listesi",
          "Next.js optimizasyonu",
          "Uygulama eşlik seansı",
        ],
      },
      professional: {
        price: "4.100",
        duration: "3-4 hafta",
        description: "İçeriği yoğun veya çok dilli yapılara yönelik kapsamlı optimizasyon.",
        features: [
          "Uçtan uca çalışma",
          "Schema ve lokalizasyon",
          "CI monitoring entegrasyonu",
          "Ekip eğitimi",
        ],
        highlighted: true,
        badge: "Popüler",
      },
      enterprise: {
        price: "7.900",
        duration: "5-7 hafta",
        description: "Kompleks mimariler ve marka portföyleri için devam eden ortaklık.",
        features: [
          "Edge & CDN optimizasyonu",
          "Search Console otomasyonu",
          "Release rollout playbook",
          "Çeyreklik iyileştirme döngüsü",
        ],
      },
    },
    cta: {
      title: "Siteniz anında açılsın",
      subtitle:
        "Stack'inizi paylaşın, ölçülebilir kilometre taşlarıyla net bir optimizasyon planı çıkaralım.",
      button: "Auditi talep et",
    },
  },
  "online-shop-setup": {
    hero: {
      title: "Kontrolü sizde olan e-ticaret",
      subtitle:
        "Dönüşüm odaklı vitrin, stok yönetimi, ödeme ve teslimat süreçlerini ekibinizin yönetebileceği şekilde kuruyoruz.",
      cta: "Mağazayı başlat",
    },
    benefits: [
      {
        title: "Güçlü temel",
        description:
          "Ürün kataloğu, varyasyonlar ve vergi kuralları hedef pazarlarınıza uygun şekilde hazırlanır.",
        icon: "/icons/online-store.png",
      },
      {
        title: "Satın alma deneyimi",
        description:
          "Performanslı ürün sayfaları, paketler ve mobil odaklı ödeme akışlarıyla alışveriş kolaylaşır.",
        icon: "/icons/global.png",
      },
      {
        title: "Operasyonel rahatlık",
        description:
          "Eğitim, dokümantasyon ve otomatik uyarılarla operasyon hacim arttıkça da sorunsuz ilerler.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "Dört haftada yayına çıktık, ilk 100 siparişi destek talebi almadan tamamladık.",
      author: "María López",
      role: "Kurucu",
      company: "Atelier No.3",
    },
    pricing: {
      starter: {
        price: "3.200",
        duration: "3-4 hafta",
        description: "Shopify veya headless vitrin; temel entegrasyonlar ve takip kurulumuyla hazır.",
        features: [
          "Ürün kataloğu kurulumu",
          "Güvenli ödeme & faturalama",
          "Kargo bölgeleri & vergiler",
          "E-posta fişleri & analytics",
        ],
      },
      professional: {
        price: "5.800",
        duration: "4-6 hafta",
        description: "Gelişmiş merchandising, otomasyon ve marka hikayesini destekleyen CMS içerikleri.",
        features: [
          "Paket & abonelik akışları",
          "Headless CMS entegrasyonu",
          "Pazarlama otomasyonları",
          "A/B test edilmiş landing şablonları",
        ],
        highlighted: true,
        badge: "En iyi seçim",
      },
      enterprise: {
        price: "9.500",
        duration: "7-9 hafta",
        description: "Kurumsal iş akışları, ERP entegrasyonu ve çok dilli genişleme.",
        features: [
          "Özel entegrasyonlar & API",
          "Depo ve ERP senkronu",
          "Performans bütçe takibi",
          "Büyüme deneyleri planı",
        ],
      },
    },
    cta: {
      title: "Mağazanızı açmaya hazır mısınız?",
      subtitle:
        "Hızlı, premium görünümlü ve ekibinizin ilk günden yönetebileceği bir e-ticaret altyapısı kuruyoruz.",
      button: "Planı oluştur",
    },
  },
  "content-management": {
    hero: {
      title: "Sürtünmesiz içerik yönetimi",
      subtitle:
        "Pazarlama ekibi kampanyaları, çevirileri ve güncellemeleri dakikalar içinde geliştirici beklemeden yayına alır.",
      cta: "Süreci gör",
    },
    benefits: [
      {
        title: "Bileşen tabanlı CMS",
        description:
          "Marka tutarlılığını koruyan, aynı zamanda editörlere esneklik veren bloklar ve önizleme akışı.",
        icon: "/icons/browser.png",
      },
      {
        title: "Yönetişim güvencesi",
        description:
          "Roller, staging ortamları ve yayın kontrol listeleri; uyum ekipleri için güven oluşturur.",
        icon: "/icons/global.png",
      },
      {
        title: "Ekip enablement'ı",
        description:
          "Dokümanlar, video walkthrough'ları ve ofis saatleri ile tüm organizasyona güven verilir.",
        icon: "/icons/training.png",
      },
    ],
    testimonial: {
      quote: "Pazarlama ekibi güncellemeleri iki kat hızlı çıkarıyor, marka ekibi de gönül rahatlığıyla onaylıyor.",
      author: "Judith Steiner",
      role: "CMO",
      company: "FlowCorp",
    },
    pricing: {
      starter: {
        price: "2.700",
        duration: "3 hafta",
        description: "Headless CMS kurulum, temel modeller ve yayın akışı; küçük ekipler için ideal.",
        features: [
          "İçerik modelleme atölyesi",
          "Bileşen kütüphanesi",
          "Taslak / onay / yayın süreçleri",
          "Editör eğitim seansı",
        ],
      },
      professional: {
        price: "4.600",
        duration: "4-5 hafta",
        description: "Kurumsal düzeyde yönetişim, lokalizasyon, asset otomasyonu ve QA araçları.",
        features: [
          "Çok dilli workflow",
          "Asset optimizasyon pipeline'ı",
          "Rol bazlı erişim & log",
          "Görsel regresyon testleri",
        ],
        highlighted: true,
        badge: "Takım favorisi",
      },
      enterprise: {
        price: "7.600",
        duration: "6-8 hafta",
        description: "Global içerik operasyonu; CRM, DAM ve analytics entegrasyonu ile.",
        features: [
          "CRM & marketing senkronu",
          "Kişiselleştirme deneyleri",
          "Değişim yönetimi rehberi",
          "Çeyreklik optimizasyon",
        ],
      },
    },
    cta: {
      title: "Ekibinizi yayın süper gücüyle tanıştırın",
      subtitle:
        "İçerik modelinizi tasarlayıp kullanıcı dostu araçlar kuruyor ve düzenli bir playbook teslim ediyoruz.",
      button: "CMS tasarla",
    },
  },
  "analytics-insights": {
    hero: {
      title: "Kararları besleyen analitik",
      subtitle:
        "Önemli metrikleri takip edin, raporlamayı otomatikleştirin ve bir sonraki sprinti yönlendirecek içgörüleri yakalayın.",
      cta: "Panel iste",
    },
    benefits: [
      {
        title: "Ortak KPI'lar",
        description:
          "Hedef hizalama oturumları ve yol haritaları, işletmenizi gerçekten ileri taşıyan metriklere odaklanır.",
        icon: "/icons/good-feedback.png",
      },
      {
        title: "Güvenilir takip",
        description:
          "Sunucu tarafı event'ler, izin uyumlu tracking ve gizlilik kontrolleri legal & veri ekiplerini rahatlatır.",
        icon: "/icons/blitz.png",
      },
      {
        title: "Anlamlı raporlama",
        description:
          "Panolar, Loom walkthrough'ları ve aksiyon listeleri her sprintte paylaşıma hazır olur.",
        icon: "/icons/speedometer.png",
      },
    ],
    testimonial: {
      quote: "El ile rapor yerine artık tek kaynak üzerinden deney planlıyor ve büyüme sprintleri yürütüyoruz.",
      author: "Claudia Meier",
      role: "Ürün Lideri",
      company: "InsightOps",
    },
    pricing: {
      starter: {
        price: "1.900",
        duration: "2 hafta",
        description: "Consent uyumlu tracking ve haftalık rapor şablonlarıyla analitik temeli.",
        features: [
          "KPI hizalama oturumu",
          "GA4 & sunucu event kurulumu",
          "Çekirdek panelli dashboard",
          "Haftalık içgörü formatı",
        ],
      },
      professional: {
        price: "3.900",
        duration: "3-4 hafta",
        description: "Çok kanallı izleme, otomatik uyarılar ve deney desteği.",
        features: [
          "Çok kanallı atribüsyon",
          "Otomatik rapor & alarm",
          "Deney backlog'u & skor",
          "Ekip enablement oturumları",
        ],
        highlighted: true,
        badge: "Analitik Pro",
      },
      enterprise: {
        price: "6.500",
        duration: "5-6 hafta",
        description: "Merkezi veri ambarı, reverse ETL ve yönetim sunum desteği.",
        features: [
          "Veri ambarı entegrasyonu",
          "Reverse ETL (CRM)",
          "Yönetici KPI anlatıları",
          "Çeyreklik optimizasyon döngüsü",
        ],
      },
    },
    cta: {
      title: "Her metriğe güvenin",
      subtitle:
        "Bugün neyi takip ettiğinizi paylaşın, net ve güvenilir kararlar için ölçüm mimarisini kuralım.",
      button: "Panoları oluştur",
    },
  },
  "handover-training": {
    hero: {
      title: "Kalıcı etki bırakan devretme & eğitim",
      subtitle:
        "Dokümantasyon, playbook ve sürekli destekle teslimatı uzun süreli ivmeye dönüştürün.",
      cta: "Enablement planla",
    },
    benefits: [
      {
        title: "Yapılandırılmış bilgi tabanı",
        description:
          "Adım adım rehberler, videolar ve runbook'lar onboarding'i ve sorun gidermeyi kolaylaştırır.",
        icon: "/icons/browser.png",
      },
      {
        title: "Etkileşimli oturumlar",
        description:
          "Rol bazlı eğitimler ve Soru&Cevap seanslarıyla tüm paydaşların güveni hızla artar.",
        icon: "/icons/training.png",
      },
      {
        title: "Lansman sonrası ortaklık",
        description:
          "Slack hattı, retrospektifler ve iyileştirme sprintleri lansman sonrası ivmeyi korur.",
        icon: "/icons/good-feedback.png",
      },
    ],
    testimonial: {
      quote: "Ekip ilk günden desteklendi ve artık akışı bozmadan bağımsız güncellemeler yapıyor.",
      author: "Patrick Jones",
      role: "Operasyon Direktörü",
      company: "FinSuite",
    },
    pricing: {
      starter: {
        price: "1.600",
        duration: "2 hafta",
        description: "Lansman sonrası güven kazanmak isteyen küçük ekipler için enablement.",
        features: [
          "Bilgi tabanı oluşturma",
          "İki canlı eğitim",
          "Kayıtlı walkthrough kütüphanesi",
          "30 gün Soru&Cevap desteği",
        ],
      },
      professional: {
        price: "3.200",
        duration: "3-4 hafta",
        description: "Değişim yönetimi ve benimseme takibi içeren kapsamlı program.",
        features: [
          "Rol bazlı eğitim planları",
          "Benimseme skor kartları",
          "Süreç otomasyonu danışmanlığı",
          "Ortak yol haritası çalışma",
        ],
        highlighted: true,
        badge: "Takım hazır",
      },
      enterprise: {
        price: "5.400",
        duration: "5-6 hafta",
        description: "Executive koçluk, ekip planlama ve çeyreklik iyileştirmelerle uzun soluklu ortaklık.",
        features: [
          "Executive enablement oturumları",
          "Hiring & staffing rehberi",
          "Her çeyrek olgunluk değerlendirmesi",
          "Dedicated success manager",
        ],
      },
    },
    cta: {
      title: "Ekibinizi uzun vadeye hazırlayın",
      subtitle:
        "Dokümantasyon, koçluk ve destekle projeden sonra da ilerlemenin devam etmesini sağlayın.",
      button: "Eğitimi planla",
    },
  },
} satisfies Record<SolutionSlug, SolutionContent>;

export const solutionDetails: Record<SupportedLanguage, Record<SolutionSlug, SolutionContent>> = {
  en: solutionDetailsEn,
  de: solutionDetailsDe,
  tr: solutionDetailsTr,
};

export const solutionSlugs = Object.keys(solutionDetailsEn) as SolutionSlug[];
