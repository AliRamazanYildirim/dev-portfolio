const enSolutions = [
  {
    title: "Websites that get you leads",
    slug: "lead-generation-websites",
    description: "Pages designed to turn visitors into contact requests",
    icon: "/icons/global.png",
    alt: "Website leads icon",
    href: "/solutions/lead-generation-websites",
  },
  {
    title: "Faster sites & better search",
    slug: "performance-seo",
    description: "Speed and basic SEO so people can find you",
    icon: "/icons/blitz.png",
    alt: "Performance icon",
    href: "/solutions/performance-seo",
  },
  {
    title: "Online shop setup",
    slug: "ecommerce-solutions",
    description: "Fast, easy-to-manage online stores",
    icon: "/icons/online-store.png",
    alt: "Online shop icon",
    href: "/solutions/ecommerce-solutions",
  },
  {
    title: "Easy content editing",
    slug: "cms-management",
    description: "A simple system that makes updating your site easy",
    icon: "/icons/browser.png",
    alt: "Content management icon",
    href: "/solutions/cms-management",
  },
  {
    title: "Track what matters",
    slug: "analytics-tracking",
    description: "Simple analytics and reports to see how your site performs",
    icon: "/icons/good-feedback.png",
    alt: "Analytics icon",
    href: "/solutions/analytics-tracking",
  },
  {
    title: "Handover & team training",
    slug: "team-training",
    description: "Guides and hands-on training so your team can run the site",
    icon: "/icons/training.png",
    alt: "Training icon",
    href: "/solutions/team-training",
  },
];

const deSolutions = [
  {
    title: "Websites, die Anfragen bringen",
    slug: "lead-generation-websites",
    description: "Seiten, die Besucher dazu bringen, Kontakt aufzunehmen",
    icon: "/icons/global.png",
    alt: "Webseiten Leads Icon",
    href: "/solutions/lead-generation-websites",
  },
  {
    title: "Schnellere Seiten & bessere Sichtbarkeit",
    slug: "performance-seo",
    description: "Mehr Geschwindigkeit und einfache SEO, damit man Sie findet",
    icon: "/icons/blitz.png",
    alt: "Performance Icon",
    href: "/solutions/performance-seo",
  },
  {
    title: "Online-Shop Einrichtung",
    slug: "ecommerce-solutions",
    description: "Schnelle, leicht zu pflegende Shops",
    icon: "/icons/online-store.png",
    alt: "Online-Shop Icon",
    href: "/solutions/ecommerce-solutions",
  },
  {
    title: "Einfach Inhalte bearbeiten",
    slug: "cms-management",
    description: "Ein System, das das Aktualisieren Ihrer Seite einfach macht",
    icon: "/icons/browser.png",
    alt: "Content-Management Icon",
    href: "/solutions/cms-management",
  },
  {
    title: "Wichtiges messen",
    slug: "analytics-tracking",
    description: "Einfache Auswertungen, um zu sehen, wie Ihre Seite läuft",
    icon: "/icons/good-feedback.png",
    alt: "Analytics Icon",
    href: "/solutions/analytics-tracking",
  },
  {
    title: "Übergabe & Team-Training",
    slug: "team-training",
    description: "Anleitungen und Training, damit Ihr Team die Seite betreibt",
    icon: "/icons/training.png",
    alt: "Training Icon",
    href: "/solutions/team-training",
  },
];

const trSolutions = [
  {
    title: "İletişim getiren siteler",
    slug: "lead-generation-websites",
    description: "Ziyaretçileri size mesaj atmaya yönlendiren sayfalar",
    icon: "/icons/global.png",
    alt: "İletişim siteleri simgesi",
    href: "/solutions/lead-generation-websites",
  },
  {
    title: "Daha hızlı site & bulunabilirlik",
    slug: "performance-seo",
    description: "Site hızı ve temel SEO ile sizi bulunur kılalım",
    icon: "/icons/blitz.png",
    alt: "Performans simgesi",
    href: "/solutions/performance-seo",
  },
  {
    title: "Online mağaza kurulumu",
    slug: "ecommerce-solutions",
    description: "Hızlı ve kolay yönetilebilen mağazalar",
    icon: "/icons/online-store.png",
    alt: "Mağaza simgesi",
    href: "/solutions/ecommerce-solutions",
  },
  {
    title: "Kolay içerik güncellemesi",
    slug: "cms-management",
    description: "Siteyi güncellemesi kolay bir yönetim sistemi",
    icon: "/icons/browser.png",
    alt: "İçerik yönetimi simgesi",
    href: "/solutions/cms-management",
  },
  {
    title: "Önemli metrikleri takip et",
    slug: "analytics-tracking",
    description: "Site performansınızı gösteren basit raporlar",
    icon: "/icons/good-feedback.png",
    alt: "Analitik simgesi",
    href: "/solutions/analytics-tracking",
  },
  {
    title: "Teslim & ekip eğitimi",
    slug: "team-training",
    description: "Ekip eğitimi ve kullanım kılavuzları ile teslimat",
    icon: "/icons/training.png",
    alt: "Eğitim simgesi",
    href: "/solutions/team-training",
  },
];

export const translations = {
  en: {
    nav: {
      languageMenu: {
        label: "Language",
        languages: {
          en: "English",
          de: "Deutsch",
          tr: "Türkçe",
        },
      },
      aria: {
        toggle: "Toggle menu",
        close: "Close menu",
        language: "Choose language",
      },
      items: [
        {
          title: "<Solutions>",
          submenu: enSolutions,
        },
        { title: "<About>", path: "/about" },
        { title: "<Projects>", path: "/projects" },
        { title: "<Contact>", path: "/#contact" },
        {
          title: "<Blog>",
          path: "https://medium.com/@aliramazanyildirim",
          external: true,
        },
        { title: "<Admin>", path: "/admin/login" },
      ],
      solutions: {
        label: "Solutions",
        items: enSolutions,
      },
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Go to",
      scrollTopAria: "Scroll to top",
      privacyLink: "Privacy Policy",
      privacyAria: "Open the privacy policy page",
      termsLink: "Terms & Conditions",
      termsAria: "Open the terms and conditions page",
    },
    hero: {
      tagline: "Websites without guesswork",
      headline: {
        leading: "Win your ideal clients and team with a",
        highlight: "website engineered for trust",
        trailing: "and measurable growth",
      },
      subheadline:
        "Partner directly with a senior full-stack developer who handles strategy, content, design, and build in one streamlined process.",
      introParagraphs: [
        "Every collaboration starts with a deep-dive workshop to uncover your value proposition, audience pains, and conversion triggers. The insights shape messaging, UX, and technical setup before any line of code is written.",
        "From there, I deliver weekly prototypes, transparent status updates, and launch-ready assets so your marketing can go live without delays or handover issues.",
      ],
      valueProps: [
        {
          title: "All-in-one delivery",
          description:
            "Discovery, copywriting, design, development, QA, and analytics—coordinated end-to-end by one accountable partner.",
        },
        {
          title: "Direct senior expertise",
          description:
            "You work exclusively with me; no handoffs to juniors, no agency overhead, just clear decisions aligned with your business goals.",
        },
        {
          title: "Conversion-first build",
          description:
            "Fast, secure Next.js sites with structured content, lead funnels, and data tracking baked in from day one.",
        },
        {
          title: "Transparent investment",
          description:
            "Fixed-scope packages, clear timelines, and proactive communication so you always know what happens next.",
        },
      ],
      ctas: {
        primary: { label: "Book a discovery call", href: "/#contact" },
        secondary: { label: "See how the process works" },
      },
      trustNote: "I respond within one business day with a tailored next step.",
      location: "Remote from Sasbach · serving clients across Europe",
      scrollLabel: "Scroll For More",
      processModal: {
        title: "The Momentum Playbook",
        subtitle:
          "Each phase keeps decision-makers aligned, delivers visible progress, and removes the guesswork from your launch.",
        closeLabel: "Close overview",
        steps: [
          {
            stage: "Phase 01",
            title: "Discovery & Strategy Architecture",
            description:
              "I zoom in on your business model, customer motivations, and success metrics so every design choice pushes toward measurable outcomes.",
            highlights: [
              "Executive workshop extracting goals, constraints, and buying triggers.",
              "Audience mapping, competitor teardown, and SEO signal analysis.",
              "Experience roadmap outlining milestones, owners, budget, and KPIs.",
            ],
            duration: "Timeline: 3–5 days",
            outcome: "Outcome: shared strategic blueprint and prioritised backlog.",
          },
          {
            stage: "Phase 02",
            title: "Messaging & Experience Blueprint",
            description:
              "I transform positioning into clear copy, UX flows, and content architecture that guide visitors from curiosity to commitment.",
            highlights: [
              "Message framework translating value propositions into persuasive narrative.",
              "Information architecture, wireflows, and interactive prototype walkthrough.",
              "Visual direction board covering mood, typography, and component language.",
            ],
            duration: "Timeline: 5–7 days",
            outcome: "Outcome: approved prototype and content plan ready for production.",
          },
          {
            stage: "Phase 03",
            title: "Design, Build & Quality Engineering",
            description:
              "Design systems, animations, and performant code come together in parallel so launch assets are production perfect.",
            highlights: [
              "Responsive design system with reusable sections, states, and microinteractions.",
              "Next.js build with best-in-class performance, accessibility, and SEO foundations.",
              "Quality assurance sprints covering cross-device testing and automation.",
            ],
            duration: "Timeline: 2–3 weeks",
            outcome: "Outcome: production-ready experience with analytics and CMS wired in.",
          },
          {
            stage: "Phase 04",
            title: "Launch, Training & Growth Enablement",
            description:
              "I choreograph deployment, train your team, and set up measurement so momentum keeps building after go-live.",
            highlights: [
              "Launch runbook with rollback plan, monitoring, and success checklist.",
              "Team training sessions plus video walkthroughs for ongoing updates.",
              "Growth dashboard combining analytics, heatmaps, and lead insights.",
            ],
            duration: "Timeline: 3–5 days",
            outcome: "Outcome: confident launch and a roadmap for continuous optimisation.",
          },
        ],
        finalNote:
          "Need to scale faster? Post-launch we partner on growth sprints, conversion experiments, and new feature rollouts—always with the same transparent cadence.",
        navigation: {
          previous: "Previous phase",
          next: "Next phase",
          jumpTo: "Jump to phase",
          progress: "Progress",
        },
      },
    },
    littleAbout: {
      heading: "A Little About Me -",
      paragraphOne:
        "I am a Full-Stack Software Developer with extensive experience in modern web technologies such as JavaScript, Node.js, Next.js, React, Blazor, and .NET Core. Through my work on e-commerce platforms, microservices, and blog applications, I have developed a strong focus on scalable software architectures and best practices. My background includes hands-on development, problem-solving, and optimizing performance in web applications.",
      paragraphTwo:
        "JavaScript, C#, TypeScript, React, and Next.js—building real-world solutions through technology. Thriving in collaborative environments, I am always looking for new ways to refine my skills and create impactful solutions.",
      cta: "(Know More About Me)",
    },
    littleProjects: {
      heading: "MY PROJECTS",
      loadingTitle: "MY PROJECTS",
      featuredBadge: "Featured Project",
      emptyTitle: "No projects yet",
      emptyDescription: "Click the button above to add your first project.",
      showAll: "Show all projects",
      loadingMessage: "Projects are loading...",
      mobileShowcase: {
        featured: "Featured",
      },
    },
    partners: {
      strapline: "Stronger together",
      heading: "Our partners",
    },
    contact: {
      headingLineOne: "Tell us your idea;",
      headingLineTwo: "we'll build the wow.",
      placeholders: {
        name: "Name",
        email: "E-Mail",
        message: "Message",
      },
      submit: "Send message",
      success: "Your message has been sent successfully. Thank you!",
      toastSending: "Message is being sent...",
      toastSuccess: "Message sent successfully.",
      toastEmailError: "Failed to send notification email, but message was saved.",
      toastErrorFallback: "An error has occurred. Please try again later.",
    },
    contactInfo: {
      badge: "Direct line",
      availability: "Available Mon–Fri • 09:00–17:00 CET",
    },
    aboutPage: {
      headline: [
        "PART-TIME",
        "TURKISH COFFEE,",
        "FULL-TIME",
        "CODINGGGGG !",
      ],
      quote:
        '"Growing up with a passion for technology, I have always seen software development as a reflection of a rapidly evolving, dynamic digital world full of possibilities. Just as innovation drives progress, coding is about adaptability, problem solving and creating lasting solutions. Every challenge is an opportunity for growth, every setback is a lesson and every success is a new milestone. I am excited to continue learning, creating and shaping the digital world with a line of code."',
      sectionHeading: "-But There Is More To Me",
      interests: [
        {
          icon: "/icons/coffee.svg",
          alt: "Coffee Icon",
          title: "Coffee Aficionado",
          description:
            "I'm a tea enthusiast who loves sipping on Turkish tea and menengiç coffee in every cozy café and traditional tea house I come across.",
        },
        {
          icon: "/icons/lego.svg",
          alt: "Lego Icon",
          title: "Cycling & Robotics Enthusiast",
          description:
            "When I'm not enjoying my tea, you'll probably find me cycling through the streets or building robotic creations with LEGO pieces.",
        },
        {
          icon: "/icons/compass.svg",
          alt: "Compass Icon",
          title: "Wanderlust Explorer",
          description:
            "In my free time, I love exploring nature, discovering hidden trails and scenic spots. Every journey feels like an adventure, and I always enjoy trying new flavors along the way!",
        },
      ],
    },
    projectsPage: {
      heading: "Projects",
      projectLabelSingular: "Project",
      projectLabelPlural: "projects",
      projectsLoading: "Projects are loading...",
      retry: "Try again",
      featured: "Featured",
      noneTitle: "No projects yet",
      noneDescription: "Click the button above to add your first project.",
      paginationInfo: {
        pageLabel: "Page",
        separator: "/",
      },
      resultsSuffix: "found",
      loadError: "Failed to load projects.",
      connectionError: "Connection error while loading projects.",
    },
    projectDetail: {
      loading: "Project is loading...",
      notFoundTitle: "Project not found",
      notFoundAction: "Back to the projects",
      featuredBadge: "Featured Project",
      aboutHeading: "About The Project",
      role: "Project Role",
      duration: "Duration",
      category: "Category",
      galleryHeading: "Project Gallery",
      technologiesHeading: "Technologies Used",
      tagsHeading: "Tags",
      previous: "Last",
      next: "Next",
      indexFallback: "Projects",
      authorPrefix: "by",
      dateLocale: "en-US",
      loadError: "An error occurred while loading the project.",
      durationLabels: {
        "1 Week": "1 Week",
        "2 Weeks": "2 Weeks",
        "3 Weeks": "3 Weeks",
        "4 Weeks": "4 Weeks",
        "1 Month": "1 Month",
        "2 Months": "2 Months",
        "3 Months": "3 Months",
        "4 Months": "4 Months",
        "5 Months": "5 Months",
        "6 Months": "6 Months",
      },
      roleLabels: {
        "Full Stack Developer": "Full Stack Developer",
        Developer: "Developer",
        Designer: "Designer",
        "Project Manager": "Project Manager",
      },
      categoryLabels: {
        "Web Development": "Web Development",
        "Mobile App Development": "Mobile App Development",
        "UI/UX Design": "UI/UX Design",
        "E-Commerce": "E-Commerce",
        Consulting: "Consulting",
      },
    },
    pagination: {
      nextAria: "Next page",
      prevAria: "Previous page",
      info: ({
        current,
        total,
        start,
        end,
        overall,
      }: {
        current: number;
        total: number;
        start: number;
        end: number;
        overall: number;
      }) => `Page ${current} / ${total} (${start}-${end} / ${overall})`,
    },
    admin: {
      login: {
        title: "Admin Login",
        subtitle: "Sign in to access the admin panel",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        emailPlaceholder: "admin@example.com",
        passwordPlaceholder: "••••••••",
        signIn: "Sign In",
        signingIn: "Signing in...",
        errorAllFields: "All fields are required",
        errorLoginFailed: "Login failed",
        errorConnection: "Connection error",
        checkingSession: "Checking session...",
        footerNote: "For authorized administrators only",
        backToHome: "← Back to home",
      },
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: 17 October 2025",
      intro: [
        "This privacy policy explains how I process personal data when you interact with the dev-portfolio application, its APIs, and connected services.",
        "The application offers multilingual content (English, German, Turkish) and is primarily intended for clients located in Germany, the EU, and Türkiye. Wherever possible we align with the EU General Data Protection Regulation (GDPR) and applicable German law.",
      ],
      sections: [
        {
          heading: "1. Controller",
          paragraphs: [
            "Ali Ramazan Yildirim, Hebelstraße 1, 77880 Sasbach, Deuschland, email: aliramazanyildirim@gmail.com, phone: +49 151 67145187, acts as the controller for all processing described here.",
            "For EU/EEA residents, you may also address requests to our German correspondence address upon request; we will reply within statutory timelines.",
          ],
        },
        {
          heading: "2. Personal Data We Process",
          paragraphs: [
            "We only process data that you actively provide or that is technically required to operate this portfolio.",
          ],
          bullets: [
            "Contact details (name, email address, message content) submitted through the contact form at /api/contact; stored with timestamp and rate-limiter metadata in our MongoDB database.",
            "Customer records created via the admin area (/api/admin/customers): first and last name, company, postal address, phone number, email, referral codes, project notes, pricing, discountRate, finalPrice, referralCount, and timestamps.",
            "Referral programme transactions saved through ReferralTransaction records, including referrerCode, discountRate (3/6/9%), referral level, and the linked customer ID.",
            "Invoice information produced with the invoice generator (InvoiceService), such as invoice number, deliverables, project descriptions, VAT calculations, and payment references.",
            "Authentication data for administrators (email, hashed password, session token stored as the httpOnly cookie \"admin-auth-token\").",
            "Technical metadata such as IP address (retained briefly by the rate limiter key), browser headers, and server logs required to secure the service.",
          ],
        },
        {
          heading: "3. Purposes and Legal Bases",
          bullets: [
            "Responding to contact requests and preparing proposals (Art. 6(1)(b) GDPR).",
            "Administering customer accounts, referral rewards, and project deliverables (Art. 6(1)(b) and 6(1)(f) GDPR).",
            "Generating invoices and meeting statutory bookkeeping duties (Art. 6(1)(c) GDPR).",
            "Delivering referral notifications and reminders via email using nodemailer (legitimate interest, Art. 6(1)(f) GDPR).",
            "Mitigating abuse, enforcing rate limits, and defending our systems (legitimate interest, Art. 6(1)(f) GDPR).",
            "Complying with legal obligations or requests from authorities (Art. 6(1)(c) GDPR).",
          ],
        },
        {
          heading: "4. Retention",
          bullets: [
            "Contact enquiries are kept for up to 12 months after completion, unless a further contract arises.",
            "Customer and referral data remain for the duration of our business relationship plus up to 3 years for limitation periods, unless bookkeeping law requires longer storage.",
            "Invoice-related information is retained for 10 years in line with German commercial and tax retention rules.",
            "Rate-limiter entries containing IP-based keys automatically expire within the configured window (60 seconds) and are then deleted.",
            "Server and security logs are purged within 90 days unless they form part of an incident investigation.",
          ],
        },
        {
          heading: "5. Recipients and Processors",
          bullets: [
            "Hosting and deployment providers used for the live portfolio (e.g. Vercel or comparable cloud platforms).",
            "Database hosting with MongoDB Atlas or another provider defined by the environment variable MONGODB_URI.",
            "Email transmission via Gmail SMTP or, in development, Ethereal test accounts operated by nodemailer.",
            "Cloudinary for media storage and responsive asset delivery when you upload images through /api/upload.",
            "Payment service providers (e.g. banks, PayPal) if you remit invoice amounts using the listed methods.",
            "Professional advisors or authorities where legally required.",
          ],
        },
        {
          heading: "6. International Transfers",
          paragraphs: [
            "Data may be processed in Turkey, the EU/EEA, and other jurisdictions where our processors operate (notably the United States for Cloudinary and Gmail).",
            "When transferring outside the EU/EEA we rely on appropriate safeguards such as Standard Contractual Clauses or equivalent guarantees provided by the respective service provider.",
          ],
        },
        {
          heading: "7. Security",
          bullets: [
            "Encrypted transport (HTTPS) for public endpoints and admin interfaces.",
            "Scoped administrative access protected by JWTs and httpOnly cookies.",
            "Rate limiting and IP throttling implemented via mongoRateLimiter to curb abuse.",
            "Regular dependency maintenance and monitoring of server logs for anomalies.",
          ],
        },
        {
          heading: "8. Your Rights",
          bullets: [
            "Access to your personal data (Art. 15 GDPR).",
            "Rectification of inaccurate data (Art. 16 GDPR).",
            "Erasure (Art. 17 GDPR) and restriction (Art. 18 GDPR) within statutory limits.",
            "Portability for data you provided to us (Art. 20 GDPR).",
            "Objection to processing based on legitimate interests (Art. 21 GDPR).",
            "Withdrawal of consent with effect for the future, where processing relies on consent.",
            "Right to lodge a complaint with a supervisory authority, especially in Germany (LfDI Baden-Württemberg) or your local authority.",
          ],
        },
        {
          heading: "9. Exercising Your Rights",
          paragraphs: [
            "Please contact us using the details below. We may ask for proof of identity to protect your data. Responses are provided without undue delay and within the deadlines set by law.",
          ],
        },
        {
          heading: "10. Client Projects and Partner Logo Showcase",
          paragraphs: [
            "As part of my professional portfolio service, I showcase projects I have developed for clients and display partner logos in the partners section of my website.",
            "This showcase serves as a reference for potential clients to understand the quality and scope of my work, and to demonstrate professional relationships with established partners.",
          ],
          bullets: [
            "Project Showcase: With explicit written consent from each client, I display project details including descriptions, technologies used, screenshots, and project outcomes. Client names and company information are only displayed when expressly permitted.",
            "Partner Logos: Partner company logos are displayed in the partners section only after obtaining explicit permission through a written agreement or contract clause. Logos are used solely for the purpose of demonstrating professional collaborations.",
            "Client Control: Clients retain the right to request removal or modification of their project information or logos at any time by contacting me directly. Such requests will be processed within 7 business days.",
            "Confidential Information: No confidential business information, proprietary code, or sensitive data is ever published without explicit written authorization. All showcase materials undergo client review and approval before publication.",
            "Legal Basis: These showcase activities are conducted under Art. 6(1)(a) GDPR (consent) and Art. 6(1)(f) GDPR (legitimate interest in presenting professional work), with client consent always taking precedence.",
          ],
        },
        {
          heading: "11. Updates",
          paragraphs: [
            "We will update this privacy policy whenever our services or legal obligations change. The current version is always available at /privacy.",
          ],
        },
      ],
      contactHeading: "Contact for privacy requests",
      contactDetails: [
        "Ali Ramazan Yildirim",
        "Address: Hebelstraße 1, 77880 Sasbach, Germany",
        "Email: aliramazanyildirim@gmail.com",
        "Phone: +49 151 67145187",
      ],
      note: "If the translations differ, the English version prevails. Local consumer protections remain unaffected.",
    },
    terms: {
      title: "Terms and Conditions",
      lastUpdated: "Last updated: 19 October 2025",
      intro: [
        "These Terms and Conditions ('Terms') govern all professional software development services provided by Ramazan Yildirim ('Service Provider', 'I', 'me') to clients ('Client', 'you') through this portfolio platform.",
        "By engaging my services, requesting a quote, or entering into a project agreement, you accept these Terms in full. These Terms apply alongside any individual project agreements or contracts.",
      ],
      sections: [
        {
          heading: "1. Scope of Services",
          paragraphs: [
            "I provide professional software development services including but not limited to:",
          ],
          bullets: [
            "Full-stack web development (React, Next.js, Node.js, Express, MongoDB)",
            "Frontend development with modern frameworks and responsive design",
            "Backend development and API integrations",
            "Enterprise system consulting and SAP/ABAP development",
            "E-commerce solutions and payment integrations (Stripe, PayPal)",
            "Project consulting, architecture design, and code optimization",
            "Custom software solutions tailored to client requirements",
          ],
        },
        {
          heading: "2. Project Engagement Process",
          bullets: [
            "Initial Consultation: Clients submit inquiries via my contact form. I respond within 2 business days with preliminary feedback.",
            "Project Proposal: Following consultation, I provide a detailed proposal including scope, timeline (1 week to 6 months), deliverables, and pricing.",
            "Agreement: Projects commence upon written acceptance of the proposal and receipt of the agreed advance payment (typically 30-50%).",
            "Development: I work according to agreed milestones with regular progress updates and client feedback sessions.",
            "Delivery & Testing: Final deliverables undergo client review. I provide a testing period of 7-14 days depending on project complexity.",
            "Final Payment & Launch: Upon client approval, final payment is due before project launch or handover.",
          ],
        },
        {
          heading: "3. Pricing and Payment Terms",
          bullets: [
            "Project Pricing: All prices are quoted in Euro (EUR) and include German VAT (19%) where applicable.",
            "Referral Discounts: Clients may benefit from my referral program offering 3%, 6%, or 9% discounts based on referral level.",
            "Payment Schedule: Standard payment terms are 50% advance, 50% upon completion. For projects exceeding 3 months, milestone-based payments apply.",
            "Payment Methods: I accept bank transfer (SEPA), PayPal, and other methods as specified in individual invoices.",
            "Late Payment: Invoices are due within 14 days. Late payments incur interest at 5% above the base rate (§ 288 BGB).",
            "Additional Costs: Costs for third-party services (hosting, APIs, premium tools) are billed separately unless included in the project quote.",
          ],
        },
        {
          heading: "4. Client Obligations",
          bullets: [
            "Timely Information: Clients must provide all necessary information, access credentials, and materials within agreed timeframes.",
            "Feedback & Approvals: Clients must review deliverables and provide feedback within agreed timeframes (typically 5-7 business days).",
            "Content Responsibility: Clients are responsible for the legality of all content, text, images, and materials they provide.",
            "Cooperation: Clients must designate a contact person authorized to make decisions and provide timely responses.",
            "Third-Party Services: Clients are responsible for maintaining licenses, subscriptions, and accounts for third-party services they use.",
          ],
        },
        {
          heading: "5. Project Timelines and Delays",
          bullets: [
            "Estimated Timelines: All project duration estimates (1 week - 6 months) are best-effort projections based on the agreed scope.",
            "Client-Caused Delays: Delays due to late client feedback, missing materials, or scope changes extend timelines proportionally without affecting my obligations.",
            "Force Majeure: I am not liable for delays caused by events beyond my reasonable control (technical failures, third-party service outages, natural disasters).",
            "Timeline Extensions: Significant scope changes may require timeline renegotiation and additional fees.",
          ],
        },
        {
          heading: "6. Changes and Additional Work",
          bullets: [
            "Scope Changes: Changes to agreed project scope require written approval and may incur additional costs and timeline extensions.",
            "Change Requests: Minor changes during development are accommodated where reasonable. Major changes are quoted separately.",
            "Additional Features: Features not included in the original scope are billed as additional work at our standard hourly rate or project-based pricing.",
            "Client Approval: All significant changes must be approved in writing by the client before implementation.",
          ],
        },
        {
          heading: "7. Intellectual Property Rights",
          bullets: [
            "Custom Code: Upon full payment, clients receive ownership of custom code developed specifically for their project.",
            "License to Use: Clients receive a perpetual, worldwide license to use all delivered work for their business purposes.",
            "Retained Rights: I retain rights to: (a) reusable code libraries and frameworks, (b) general methodologies and techniques, (c) my own pre-existing intellectual property.",
            "Third-Party Components: Open-source components and third-party libraries remain subject to their respective licenses.",
            "Portfolio Usage: As stated in my Privacy Policy, I may showcase project work with client consent. Clients can request removal anytime.",
            "Confidentiality: I maintain confidentiality of client business information and do not disclose proprietary code or sensitive data without authorization.",
          ],
        },
        {
          heading: "8. Quality Assurance and Testing",
          bullets: [
            "Quality Standards: All deliverables meet professional industry standards and agreed specifications.",
            "Browser Compatibility: Web projects are tested on major browsers (Chrome, Firefox, Safari, Edge) in their current and previous major versions.",
            "Responsive Design: Projects include responsive design for desktop, tablet, and mobile devices unless explicitly excluded.",
            "Testing Period: Clients have 7-14 days post-delivery to report issues. I fix bugs and errors discovered during this period at no additional cost.",
            "Bug Fixes: Critical bugs affecting core functionality are prioritized. Minor UI issues are addressed based on availability.",
          ],
        },
        {
          heading: "9. Warranties and Limitations",
          bullets: [
            "Functional Warranty: I warrant that delivered work will function substantially as described in project documentation for 30 days post-delivery.",
            "No Business Outcome Warranty: I do not guarantee specific business results, revenue, traffic, conversions, or SEO rankings.",
            "Third-Party Services: I am not responsible for failures, changes, or discontinuation of third-party services (APIs, hosting, payment processors).",
            "Browser/Platform Changes: I am not liable for functionality changes due to browser updates, platform changes, or deprecation of technologies.",
            "Client Modifications: Warranty becomes void if clients modify delivered code without my consultation.",
          ],
        },
        {
          heading: "10. Support and Maintenance",
          bullets: [
            "Initial Support: 30 days of email support are included post-delivery for questions and minor adjustments.",
            "Extended Support: Ongoing maintenance, hosting management, and feature updates are available through separate maintenance agreements.",
            "Response Times: Support requests are acknowledged within 1-2 business days. Resolution time depends on issue complexity.",
            "Separate Fees: Support beyond the initial 30-day period is billed hourly or through monthly maintenance packages.",
          ],
        },
        {
          heading: "11. Liability and Indemnification",
          bullets: [
            "Liability Cap: My total liability for any claims arising from a project is limited to the total fees paid for that project.",
            "Exclusions: I am not liable for indirect, consequential, or special damages including lost profits, data loss, or business interruption.",
            "Client Indemnification: Clients indemnify me against claims arising from: (a) content they provide, (b) their use of delivered work, (c) violation of third-party rights, (d) non-compliance with applicable laws.",
            "German Law: Maximum liability follows German statutory limits (§ 521 BGB for gift elements, § 619a BGB for service contracts).",
          ],
        },
        {
          heading: "12. Confidentiality and Data Protection",
          bullets: [
            "Confidential Information: Both parties agree to keep confidential information exchanged during the project strictly confidential.",
            "Data Protection: Personal data processing follows my Privacy Policy and GDPR requirements.",
            "Security Measures: I implement industry-standard security measures to protect client data and project materials.",
            "Data Retention: Project files and communications are retained for 3 years after project completion for legal and warranty purposes.",
          ],
        },
        {
          heading: "13. Termination and Cancellation",
          bullets: [
            "Client Termination: Clients may terminate projects with 14 days written notice. Completed work up to termination date must be paid in full.",
            "Service Provider Termination: I may terminate projects if: (a) client breaches payment terms, (b) client fails to fulfill obligations, (c) project becomes infeasible.",
            "Mutual Termination: Projects may be terminated by mutual written agreement with fair settlement of completed work.",
            "Effect of Termination: Upon termination, clients receive all completed work deliverables and pay for work completed to date.",
            "Refunds: Advance payments are non-refundable except where I fail to deliver agreed services or terminate without cause.",
          ],
        },
        {
          heading: "14. Dispute Resolution",
          bullets: [
            "Good Faith Negotiation: Parties agree to first attempt resolution through good faith negotiation.",
            "Mediation: If negotiation fails, parties agree to attempt mediation before pursuing legal action.",
            "Governing Law: These Terms are governed by German law, excluding UN sales law (CISG).",
            "Jurisdiction: Exclusive jurisdiction lies with the courts of Offenburg, Germany (nearest to 77880 Sasbach).",
            "Language: In case of disputes, the German version of these Terms prevails.",
          ],
        },
        {
          heading: "15. General Provisions",
          bullets: [
            "Entire Agreement: These Terms, together with individual project agreements, constitute the entire agreement between parties.",
            "Amendments: Changes to these Terms require written agreement. Project-specific amendments do not affect these general Terms.",
            "Severability: If any provision is found unenforceable, remaining provisions continue in full effect.",
            "Assignment: Clients may not assign project agreements without our written consent. We may assign with reasonable notice.",
            "Force Majeure: Neither party is liable for failure to perform due to circumstances beyond reasonable control.",
            "Survival: Provisions regarding intellectual property, confidentiality, payment, and liability survive project completion or termination.",
          ],
        },
        {
          heading: "16. Referral Program Terms",
          bullets: [
            "Eligibility: Clients who refer new clients receive discounts on their own projects: 3% (1st referral), 6% (2nd), 9% (3rd+).",
            "Valid Referrals: Referrals must result in completed paid projects. Discounts apply to the referring client's next project.",
            "No Cash Value: Referral discounts have no cash value and cannot be transferred or combined with other promotions.",
            "Program Changes: I reserve the right to modify or terminate the referral program with 30 days notice to active participants.",
          ],
        },
      ],
      contactHeading: "Questions about these Terms?",
      contactDetails: [
        "Ramazan Yildirim",
        "Software Development Services",
        "Address: Hebelstraße 1, 77880 Sasbach, Germany",
        "Email: aliramazanyildirim@gmail.com",
        "Phone: +49 151 67145187",
      ],
      note: "These Terms are provided in English, German, and Turkish. In case of discrepancies, the German version prevails for clients in Germany/EU, subject to mandatory consumer protection laws.",
    },
    solutions: {
      leadGeneration: {
        slug: "lead-generation-websites",
        title: "Websites that get you leads",
        subtitle: "Turn your visitors into opportunities",
        hero: {
          headline: "Your website as a sales engine",
          description: "Every page, every copy, every interaction designed to capture attention and turn visitors into decision-makers ready to engage with your business.",
          cta: "Start capturing leads today",
        },
        features: [
          {
            title: "Conversion-Optimized Copy",
            description: "Every word is chosen to remove friction and guide visitors toward action.",
            icon: "✨",
          },
          {
            title: "Lead Capture Forms",
            description: "Smart forms that capture the right data at the right time.",
            icon: "📋",
          },
          {
            title: "Trust Signals & Social Proof",
            description: "Testimonials and certifications positioned to overcome buyer objections.",
            icon: "⭐",
          },
        ],
        testimonial: {
          quote: "Within the first three months, we saw a 45% increase in qualified leads.",
          author: "Sarah K.",
          role: "B2B SaaS Founder",
          metric: "+45% leads",
        },
        pricing: [
          {
            name: "Starter",
            price: "€2,500",
            features: ["Up to 5 pages", "Lead capture form", "Mobile responsive", "Basic analytics"],
          },
          {
            name: "Professional",
            price: "€5,500",
            features: ["Up to 15 pages", "Advanced forms", "CRM integration", "A/B testing"],
            highlight: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            features: ["Unlimited pages", "Full automation", "Custom integrations", "Dedicated account"],
          },
        ],
      },
      performanceSeo: {
        slug: "performance-seo",
        title: "Faster sites & better search",
        subtitle: "Speed and visibility that drives results",
        hero: {
          headline: "Fast enough to win, visible enough to be found",
          description: "A site that loads in 1 second converts 7x better. We engineer for speed and SEO from day one.",
          cta: "Boost your site speed",
        },
        features: [
          { title: "Core Web Vitals Optimized", description: "LCP, FID, CLS—optimized for every Google metric.", icon: "⚡" },
          { title: "SEO Architecture", description: "Structured data and internal linking for immediate search visibility.", icon: "🔍" },
          { title: "Performance Monitoring", description: "Real-time dashboards tracking speed and organic visibility.", icon: "📊" },
        ],
        testimonial: { quote: "Site speed improved from 4.2s to 1.1s. Organic traffic up 62% in 4 months.", author: "Michael T.", role: "E-commerce Manager", metric: "+62% organic" },
        pricing: [
          { name: "Speed Audit", price: "€500", features: ["Full analysis", "Bottleneck identification", "Optimization roadmap"] },
          { name: "Performance Sprint", price: "€3,500", features: ["Complete optimization", "Image CDN", "Code splitting"], highlight: true },
          { name: "SEO & Performance", price: "€6,000", features: ["Full SEO", "Technical audit", "Schema markup"] },
        ],
      },
      ecommerceSolutions: {
        slug: "ecommerce-solutions",
        title: "Online shop setup",
        subtitle: "From zero to profitable sales",
        hero: {
          headline: "Your storefront, automated and optimized",
          description: "More than products and prices. It's about trust, convenience, and removing every reason to leave without buying.",
          cta: "Launch your store",
        },
        features: [
          { title: "Product Management", description: "Intuitive admin. Upload products, manage inventory, set pricing.", icon: "🛍️" },
          { title: "Payment Integration", description: "Stripe, PayPal, and more. PCI-compliant. Checkout optimized.", icon: "💳" },
          { title: "Fulfillment Ready", description: "Order tracking, shipping integrations, customer notifications.", icon: "📦" },
        ],
        testimonial: { quote: "Cut fees by 40% while gaining complete control over our store.", author: "Elena M.", role: "Fashion Brand Owner", metric: "40% fee reduction" },
        pricing: [
          { name: "Essential Shop", price: "€4,000", features: ["Up to 50 products", "Basic inventory", "Payment processing"] },
          { name: "Growth Shop", price: "€8,000", features: ["Unlimited products", "Advanced inventory", "Email automation"], highlight: true },
          { name: "Enterprise", price: "Custom", features: ["Multi-channel", "Wholesale", "Subscriptions"] },
        ],
      },
      cmsManagement: {
        slug: "cms-management",
        title: "Easy content editing",
        subtitle: "Update your site without a developer",
        hero: {
          headline: "Your content, your rules. No code required.",
          description: "A CMS that feels natural. Publish posts, update pages, manage team info—all from an interface you'll actually want to use.",
          cta: "Empower your team",
        },
        features: [
          { title: "Visual Editor", description: "WYSIWYG interface for non-technical team members. Real-time preview.", icon: "✏️" },
          { title: "Content Scheduling", description: "Plan content weeks in advance. Auto-publish at optimal times.", icon: "📅" },
          { title: "Team Collaboration", description: "Multi-user roles, permissions, and approval workflows built in.", icon: "👥" },
        ],
        testimonial: { quote: "Marketing team now publishes changes instantly. Productivity through the roof.", author: "David P.", role: "Marketing Director", metric: "5x faster updates" },
        pricing: [
          { name: "Simple CMS", price: "€1,500", features: ["5 content types", "Basic editor", "1-3 users"] },
          { name: "Team CMS", price: "€3,500", features: ["Unlimited types", "Visual editor", "10+ users"], highlight: true },
          { name: "Advanced", price: "€6,500", features: ["Custom fields", "Webhooks", "Versioning"] },
        ],
      },
      analyticsTracking: {
        slug: "analytics-tracking",
        title: "Track what matters",
        subtitle: "Data-driven insights into your site",
        hero: {
          headline: "See what's working. Fix what's not.",
          description: "Raw data isn't insight. We set up analytics that answer real questions about visitors, conversions, and opportunities.",
          cta: "Get clarity today",
        },
        features: [
          { title: "Goal Tracking", description: "Track submissions, purchases, signups. Know which channels drive real value.", icon: "🎯" },
          { title: "Behavioral Insights", description: "Heatmaps, session recordings, scroll maps. See exactly how visitors interact.", icon: "👀" },
          { title: "Custom Dashboards", description: "Monthly reports highlighting what matters. Actionable, not overwhelming.", icon: "📈" },
        ],
        testimonial: { quote: "Finally understood which pages drive conversions. Doubled our conversion rate.", author: "Jessica L.", role: "Startup Founder", metric: "2x conversion rate" },
        pricing: [
          { name: "Essential", price: "€300/month", features: ["Basic tracking", "Monthly reports", "Goal setup"] },
          { name: "Pro", price: "€800/month", features: ["Advanced tracking", "Heatmaps", "Session recordings"], highlight: true },
          { name: "Analytics+", price: "€1,500/month", features: ["Everything in Pro", "A/B testing", "24/7 support"] },
        ],
      },
      teamTraining: {
        slug: "team-training",
        title: "Handover & team training",
        subtitle: "Empower your team to own the site",
        hero: {
          headline: "Knowledge transfer that sticks",
          description: "A handover that actually works. Video walkthroughs, written guides, live Q&A sessions, and ongoing support.",
          cta: "Invest in your team",
        },
        features: [
          { title: "Comprehensive Documentation", description: "Step-by-step guides and video tutorials tailored to each role.", icon: "📚" },
          { title: "Live Training Sessions", description: "On-site or remote workshops covering everything from daily updates to advanced configuration.", icon: "🎓" },
          { title: "Ongoing Support", description: "Dedicated support channel for questions. We're here when you need us.", icon: "🤝" },
        ],
        testimonial: { quote: "The training was incredibly thorough. Our entire team felt confident immediately.", author: "Thomas R.", role: "Operations Manager", metric: "100% team confidence" },
        pricing: [
          { name: "Standard", price: "€2,000", features: ["Written guides", "Video tutorials", "1 live session"] },
          { name: "Premium", price: "€4,500", features: ["Everything in Standard", "2-day training", "30-day support"], highlight: true },
          { name: "Extended Support", price: "€1,200/month", features: ["Monthly training", "Dedicated channel", "Strategic guidance"] },
        ],
      },
    },
  },
  de: {
    nav: {
      languageMenu: {
        label: "Sprache",
        languages: {
          en: "Englisch",
          de: "Deutsch",
          tr: "Türkisch",
        },
      },
      aria: {
        toggle: "Menü umschalten",
        close: "Menü schließen",
        language: "Sprache auswählen",
      },
      items: [
        {
          title: "<Lösungen>",
          submenu: deSolutions,
        },
        { title: "<Über mich>", path: "/about" },
        { title: "<Projekte>", path: "/projects" },
        { title: "<Kontakt>", path: "/#contact" },
        {
          title: "<Blog>",
          path: "https://medium.com/@aliramazanyildirim",
          external: true,
        },
        { title: "<Admin>", path: "/admin/login" },
      ],
      solutions: {
        label: "Lösungen",
        items: deSolutions,
      },
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Besuche",
      scrollTopAria: "Nach oben scrollen",
      privacyLink: "Datenschutzerklärung",
      privacyAria: "Zur Datenschutzerklärung wechseln",
      termsLink: "AGB",
      termsAria: "Zu den Allgemeinen Geschäftsbedingungen wechseln",
    },
    hero: {
      tagline: "Websites ohne Umwege",
      headline: {
        leading: "Mehr passende Anfragen und Talente dank einer",
        highlight: "Website, der man vertraut",
        trailing: "und die Ergebnisse messbar macht",
      },
      subheadline:
        "Arbeiten Sie direkt mit einem erfahrenen Full-Stack-Entwickler, der Strategie, Inhalte, Design und Entwicklung in einem klaren Prozess vereint.",
      introParagraphs: [
        "Zu Beginn analysieren wir Ihr Angebot, die Zielgruppe und konkrete Conversion-Hebel. Diese Erkenntnisse fließen in Storytelling, UX und technische Architektur, bevor die Umsetzung startet.",
        "Sie erhalten wöchentliche Prototypen, transparente Status-Updates und launchfertige Assets, damit Marketing und Vertrieb ohne Reibungsverluste weiterarbeiten können.",
      ],
      valueProps: [
        {
          title: "Komplettservice aus einer Hand",
          description:
            "Discovery, Texte, UX, Entwicklung, Qualitätssicherung und Tracking – koordiniert von einem verantwortlichen Partner.",
        },
        {
          title: "Direkter Senior-Kontakt",
          description:
            "Sie arbeiten ausschließlich mit mir – schnelle Rückmeldungen, klare Entscheidungen und Fokus auf Ihre Geschäftsziele.",
        },
        {
          title: "Conversion-starke Umsetzung",
          description:
            "Schnelle, sichere Next.js-Seiten mit strukturierter Inhaltshierarchie, Lead-Funnels und sauberem Tracking ab dem ersten Tag.",
        },
        {
          title: "Volle Kostentransparenz",
          description:
            "Fix definierte Pakete, klare Zeitpläne und proaktive Kommunikation, damit Sie jeden Schritt vorab kennen.",
        },
      ],
      ctas: {
        primary: {
          label: "Unverbindliches Erstgespräch buchen",
          href: "/#contact",
        },
        secondary: { label: "Ablauf der Zusammenarbeit ansehen" },
      },
      trustNote: "Antwort innerhalb von 24 Stunden mit konkretem Vorschlag.",
      location: "Remote aus Sasbach · Projekte in DACH & Europa",
      scrollLabel: "Scroll für mehr",
      processModal: {
        title: "Der Momentum-Fahrplan",
        subtitle:
          "Jede Phase sorgt für gemeinsame Entscheidungen, sichtbaren Fortschritt und nimmt dem Launch die Unsicherheit.",
        closeLabel: "Übersicht schließen",
        steps: [
          {
            stage: "Phase 01",
            title: "Discovery & Strategie-Architektur",
            description:
              "Geschäftsmodell, Kundenerwartungen und Erfolgskennzahlen analysiere ich, damit jede Designentscheidung messbare Resultate liefert.",
            highlights: [
              "Executive-Workshop zur Ermittlung von Zielen, Restriktionen und Kaufmotiven.",
              "Audience-Mapping, Wettbewerbsanalyse und SEO-Signalbewertung für klares Positioning.",
              "Experience-Roadmap mit Meilensteinen, Verantwortlichkeiten, Budget und KPIs.",
            ],
            duration: "Zeitrahmen: 3–5 Tage",
            outcome: "Ergebnis: Geteilte strategische Blaupause und priorisiertes Backlog.",
          },
          {
            stage: "Phase 02",
            title: "Messaging- & Experience-Blueprint",
            description:
              "Die Positionierung in klare Texte übersetze ich, UX-Flows und Content-Architektur, die Besucher:innen von Interesse zu Handlung führen.",
            highlights: [
              "Message-Framework, das Value Proposition in eine überzeugende Storyline verwandelt.",
              "Informationsarchitektur, Nutzerflüsse und interaktiver Prototyp-Walkthrough.",
              "Visuelles Direction-Board für Mood, Typografie und Komponenten-Sprache.",
            ],
            duration: "Zeitrahmen: 5–7 Tage",
            outcome: "Ergebnis: Abgenommener Prototyp und Content-Plan für die Umsetzung.",
          },
          {
            stage: "Phase 03",
            title: "Design, Build & Qualitätsengineering",
            description:
              "Designsystem, Animationen und performanter Code entstehen parallel, damit alle Launch-Assets produktionsreif sind.",
            highlights: [
              "Responsives Designsystem mit wiederverwendbaren Sektionen, Zuständen und Mikrointeraktionen.",
              "Next.js-Implementierung mit Performance-, Accessibility- und SEO-Best-Practices.",
              "Quality-Assurance-Sprints mit Device-Tests und automatisierten Checks.",
            ],
            duration: "Zeitrahmen: 2–3 Wochen",
            outcome: "Ergebnis: Launch-fertiges Erlebnis mit Analytics- und CMS-Anbindung.",
          },
          {
            stage: "Phase 04",
            title: "Launch, Training & Growth Enablement",
            description:
              "Ich orchestriere das Go-Live, schule das Team und richte Messpunkte ein, damit der Schwung nach dem Launch anhält.",
            highlights: [
              "Launch-Runbook mit Rollback-Plan, Monitoring und Erfolgskontrolle.",
              "Team-Trainings inkl. Video-Walkthroughs für zukünftige Updates.",
              "Growth-Dashboard mit Analytics, Heatmaps und Lead-Insights.",
            ],
            duration: "Zeitrahmen: 3–5 Tage",
            outcome: "Ergebnis: Sicherer Launch und Roadmap für laufende Optimierung.",
          },
        ],
        finalNote:
          "Nach dem Launch begleiten wir auf Wunsch mit Growth-Sprints, Conversion-Experimenten und neuen Features – stets mit derselben transparenten Taktung.",
        navigation: {
          previous: "Vorherige Phase",
          next: "Nächste Phase",
          jumpTo: "Phase auswählen",
          progress: "Fortschritt",
        },
      },
    },
    littleAbout: {
      heading: "Ein bisschen über mich -",
      paragraphOne:
        "Ich bin Full-Stack-Softwareentwickler mit umfassender Erfahrung in modernen Webtechnologien wie JavaScript, Node.js, Next.js, React, Blazor und .NET Core. Durch meine Arbeit an E-Commerce-Plattformen, Microservices und Blog-Anwendungen habe ich einen starken Fokus auf skalierbare Softwarearchitekturen und Best Practices entwickelt. Mein Hintergrund umfasst praktische Entwicklung, Problemlösung und Performance-Optimierung von Webanwendungen.",
      paragraphTwo:
        "JavaScript, C#, TypeScript, React und Next.js – mit Technologie reale Lösungen schaffen. Ich liebe kollaborative Umgebungen, lerne ständig dazu und entwickle Lösungen mit Mehrwert.",
      cta: "(Mehr über mich)",
    },
    littleProjects: {
      heading: "MEINE PROJEKTE",
      loadingTitle: "MEINE PROJEKTE",
      featuredBadge: "Ausgewähltes Projekt",
      emptyTitle: "Noch keine Projekte",
      emptyDescription:
        "Klicke auf den Button oben, um dein erstes Projekt hinzuzufügen.",
      showAll: "Alle Projekte anzeigen",
      loadingMessage: "Projekte werden geladen...",
      mobileShowcase: {
        featured: "Ausgewählt",
      },
    },
    partners: {
      strapline: "Gemeinsam stärker",
      heading: "Unsere Partner",
    },
    contact: {
      headingLineOne: "Teilen Sie mir Ihre Idee mit;",
      headingLineTwo: "ich sorge für den Wow-Effekt.",
      placeholders: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
      },
      submit: "Nachricht senden",
      success: "Deine Nachricht wurde erfolgreich versendet. Vielen Dank!",
      toastSending: "Nachricht wird gesendet...",
      toastSuccess: "Nachricht erfolgreich gesendet.",
      toastEmailError:
        "Benachrichtigungs-E-Mail konnte nicht gesendet werden, die Nachricht wurde jedoch gespeichert.",
      toastErrorFallback:
        "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
    },
    contactInfo: {
      badge: "Direkter Draht",
      availability: "Verfügbar Mo–Fr • 09:00–17:00 CET",
    },
    aboutPage: {
      headline: [
        "TEILZEIT",
        "TÜRKISCHER KAFFEE,",
        "VOLLZEIT",
        "CODINGGGGG !",
      ],
      quote:
        '"Da ich mit einer Leidenschaft für Technologie aufgewachsen bin, habe ich die Softwareentwicklung immer als Spiegelbild einer sich schnell entwickelnden, dynamischen digitalen Welt voller Möglichkeiten gesehen. So wie Innovation den Fortschritt vorantreibt, geht es beim Programmieren um Anpassungsfähigkeit, Problemlösung und die Schaffung dauerhafter Lösungen. Jede Herausforderung ist eine Chance für Wachstum, jeder Rückschlag eine Lektion und jeder Erfolg ein neuer Meilenstein. Ich freue mich darauf, weiter zu lernen, zu gestalten und die digitale Welt mit einer Reihe von Code zu formen."',
      sectionHeading: "-Aber da ist noch mehr",
      interests: [
        {
          icon: "/icons/coffee.svg",
          alt: "Kaffee Icon",
          title: "Kaffee-Liebhaber",
          description:
            "Ich bin ein Teeliebhaber und genieße türkischen Tee und Menengiç-Kaffee in jedem gemütlichen Café und traditionellen Teehaus, das ich finde.",
        },
        {
          icon: "/icons/lego.svg",
          alt: "Lego Icon",
          title: "Fahrrad- & Robotics-Fan",
          description:
            "Wenn ich keinen Tee genieße, findet man mich auf dem Fahrrad oder beim Bauen von Roboterkreationen aus LEGO.",
        },
        {
          icon: "/icons/compass.svg",
          alt: "Kompass Icon",
          title: "Entdecker",
          description:
            "In meiner Freizeit erkunde ich gern die Natur, entdecke versteckte Pfade und wunderschöne Orte. Jede Reise ist ein Abenteuer – und neue Geschmäcker dürfen nicht fehlen!",
        },
      ],
    },
    projectsPage: {
      heading: "Projekte",
      projectLabelSingular: "Projekt",
      projectLabelPlural: "Projekte",
      projectsLoading: "Projekte werden geladen...",
      retry: "Erneut versuchen",
      featured: "Ausgewählt",
      noneTitle: "Noch keine Projekte",
      noneDescription:
        "Klicke auf den Button oben, um dein erstes Projekt hinzuzufügen.",
      paginationInfo: {
        pageLabel: "Seite",
        separator: "/",
      },
      resultsSuffix: "gefunden",
      loadError: "Fehler beim Laden der Projekte.",
      connectionError: "Verbindungsfehler beim Laden der Projekte.",
    },
    projectDetail: {
      loading: "Projekt wird geladen...",
      notFoundTitle: "Projekt nicht gefunden",
      notFoundAction: "Zurück zu den Projekten",
      featuredBadge: "Ausgewähltes Projekt",
      aboutHeading: "Über das Projekt",
      role: "Projektrolle",
      duration: "Dauer",
      category: "Kategorie",
      galleryHeading: "Projektgalerie",
      technologiesHeading: "Eingesetzte Technologien",
      tagsHeading: "Tags",
      previous: "Zurück",
      next: "Weiter",
      indexFallback: "Projekte",
      authorPrefix: "von",
      dateLocale: "de-DE",
      loadError: "Fehler beim Laden des Projekts",
      durationLabels: {
        "1 Week": "1 Woche",
        "2 Weeks": "2 Wochen",
        "3 Weeks": "3 Wochen",
        "4 Weeks": "4 Wochen",
        "1 Month": "1 Monat",
        "2 Months": "2 Monate",
        "3 Months": "3 Monate",
        "4 Months": "4 Monate",
        "5 Months": "5 Monate",
        "6 Months": "6 Monate",
      },
      roleLabels: {
        "Full Stack Developer": "Full-Stack-Entwickler",
        Developer: "Entwickler",
        Designer: "Designer",
        "Project Manager": "Projektmanager",
      },
      categoryLabels: {
        "Web Development": "Webentwicklung",
        "Mobile App Development": "Mobile App Entwicklung",
        "UI/UX Design": "UI/UX Design",
        "E-Commerce": "E-Commerce",
        Consulting: "Beratung",
      },
    },
    pagination: {
      nextAria: "Nächste Seite",
      prevAria: "Vorherige Seite",
      info: ({ current, total, start, end, overall }: {
        current: number;
        total: number;
        start: number;
        end: number;
        overall: number;
      }) => `Seite ${current} / ${total} (${start}-${end} / ${overall})`,
    },
    admin: {
      login: {
        title: "Admin-Anmeldung",
        subtitle: "Melde dich an, um das Admin-Panel zu betreten",
        emailLabel: "E-Mail-Adresse",
        passwordLabel: "Passwort",
        emailPlaceholder: "admin@example.com",
        passwordPlaceholder: "••••••••",
        signIn: "Anmelden",
        signingIn: "Anmeldung läuft...",
        errorAllFields: "Alle Felder sind erforderlich",
        errorLoginFailed: "Anmeldung fehlgeschlagen",
        errorConnection: "Verbindungsfehler",
        checkingSession: "Session wird geprüft...",
        footerNote: "Nur für autorisierte Administrator:innen",
        backToHome: "← Zurück zur Startseite",
      },
    },
    privacy: {
      title: "Datenschutzerklärung",
      lastUpdated: "Stand: 17. Oktober 2025",
      intro: [
        "Diese Datenschutzerklärung erläutert, wie ich personenbezogene Daten verarbeite, wenn Sie mit der dev-portfolio-Anwendung, ihren APIs und den damit verbundenen Diensten interagieren.",
        "Die Anwendung bietet mehrsprachige Inhalte (Englisch, Deutsch, Türkisch) und richtet sich in erster Linie an Kunden in Deutschland, der EU und der Türkei. Wo immer möglich, richten wir uns nach der EU-Datenschutz-Grundverordnung (DSGVO) und dem geltenden deutschen Recht.",
      ],
      sections: [
        {
          heading: "1. Verantwortlicher",
          paragraphs: [
            "Ali Ramazan Yildirim, Hebelstraße 1, 77880 Sasbach, Deutschland, E-Mail: aliramazanyildirim@gmail.com, Telefon: +49 151 67145187, fungiert als Verantwortlicher für alle hier beschriebenen Verarbeitungen.",
            "Als Einwohner der EU/des EWR können Sie Anfragen auf Wunsch auch an unsere deutsche Korrespondenzadresse richten; wir werden Ihnen innerhalb der gesetzlichen Fristen antworten.",
          ],
        },
        {
          heading: "2. Verarbeitete personenbezogene Daten",
          paragraphs: [
            "Wir verarbeiten nur Daten, die Sie aktiv bereitstellen oder die technisch zur Bereitstellung dieses Portfolios erforderlich sind.",
          ],
          bullets: [
            "Kontaktdaten (Name, E-Mail-Adresse, Nachrichteninhalt), die Sie über das Kontaktformular (/api/contact) senden; gespeichert in unserer MongoDB-Datenbank inklusive Zeitstempel und Rate-Limiter-Metadaten.",
            "Kundendaten, die im Admin-Bereich (/api/admin/customers) erfasst werden: Vor- und Nachname, Firma, Postanschrift, Telefonnummer, E-Mail, Referral-Codes, Projektnotizen, Preisangaben, discountRate, finalPrice, referralCount sowie Zeitstempel.",
            "Einträge aus dem Empfehlungsprogramm (ReferralTransaction): referrerCode, Rabattstufen (3/6/9 %), Referral-Level und die jeweils verknüpfte Kunden-ID.",
            "Rechnungsinformationen, die mit dem Rechnungsgenerator (InvoiceService) erstellt werden, wie Rechnungsnummer, Lieferumfang, Projektbeschreibung, MwSt.-Berechnungen und Zahlungsreferenzen.",
            "Authentifizierungsdaten für Administrator:innen (E-Mail, gehashte Passwörter, Sitzungstoken als httpOnly-Cookie \"admin-auth-token\").",
            "Technische Metadaten wie IP-Adressen (kurzzeitig in den Rate-Limiter-Schlüsseln gespeichert), Browser-Header und Server-Logs zur Absicherung des Dienstes.",
          ],
        },
        {
          heading: "3. Zwecke und Rechtsgrundlagen",
          bullets: [
            "Beantwortung von Kontaktanfragen und Angebotserstellung (Art. 6 Abs. 1 lit. b DSGVO).",
            "Verwaltung von Kund:innen, Empfehlungsvergütungen und Projektergebnissen (Art. 6 Abs. 1 lit. b und lit. f DSGVO).",
            "Erstellung von Rechnungen und Erfüllung gesetzlicher Buchführungspflichten (Art. 6 Abs. 1 lit. c DSGVO).",
            "Versand von Empfehlungs-E-Mails und Erinnerungen über nodemailer (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO).",
            "Missbrauchsvermeidung, Durchsetzung von Rate Limits und Schutz unserer Systeme (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO).",
            "Erfüllung rechtlicher Verpflichtungen oder behördlicher Anordnungen (Art. 6 Abs. 1 lit. c DSGVO).",
          ],
        },
        {
          heading: "4. Aufbewahrungsfristen",
          bullets: [
            "Kontaktanfragen speichern wir bis zu 12 Monate nach Abschluss, sofern kein Folgeauftrag entsteht.",
            "Kunden- und Referral-Daten bewahren wir für die Dauer der Geschäftsbeziehung sowie bis zu 3 Jahre für Verjährungsfristen auf, sofern keine längeren gesetzlichen Pflichten bestehen.",
            "Rechnungsrelevante Informationen werden gemäß deutschen Handels- und Steuervorschriften 10 Jahre lang gespeichert.",
            "Rate-Limiter-Einträge mit IP-Schlüsseln verfallen automatisch nach dem konfigurierten Zeitfenster (60 Sekunden) und werden anschließend gelöscht.",
            "Server- und Sicherheitsprotokolle werden innerhalb von 90 Tagen entfernt, sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls benötigt werden.",
          ],
        },
        {
          heading: "5. Empfänger und Auftragsverarbeiter",
          bullets: [
            "Hosting- und Deployment-Anbieter, die für das Live-Portfolio genutzt werden (z. B. Vercel oder vergleichbare Cloud-Plattformen).",
            "Datenbank-Hosting über MongoDB Atlas oder einen anderen, über die Umgebungsvariable MONGODB_URI definierten Anbieter.",
            "E-Mail-Versand via Gmail-SMTP oder – in der Entwicklung – Ethereal-Testkonten von nodemailer.",
            "Cloudinary für die Speicherung und Auslieferung von Medien, sofern Sie Bilder über /api/upload hochladen.",
            "Zahlungsdienstleister (Banken, PayPal), wenn Sie Rechnungen über die angegebenen Methoden begleichen.",
            "Berater:innen oder Behörden, soweit gesetzlich vorgeschrieben.",
          ],
        },
        {
          heading: "6. Datenübermittlungen in Drittländer",
          paragraphs: [
            "Daten können in der Türkei, der EU/dem EWR sowie in weiteren Ländern verarbeitet werden, in denen unsere Dienstleister tätig sind (insbesondere in den USA für Cloudinary und Gmail).",
            "Bei Übermittlungen außerhalb des EWR stützen wir uns auf geeignete Garantien wie EU-Standardvertragsklauseln oder gleichwertige Schutzmaßnahmen der jeweiligen Anbieter.",
          ],
        },
        {
          heading: "7. Sicherheit",
          bullets: [
            "Verschlüsselte Übertragung (HTTPS) für öffentliche Endpunkte und Admin-Oberflächen.",
            "Beschränkter Administrationszugriff, geschützt durch JWTs und httpOnly-Cookies.",
            "Rate-Limiting und IP-Drosselung über mongoRateLimiter zur Missbrauchsprävention.",
            "Regelmäßige Wartung der Abhängigkeiten sowie Überwachung der Server-Logs.",
          ],
        },
        {
          heading: "8. Ihre Rechte",
          bullets: [
            "Auskunft über die gespeicherten Daten (Art. 15 DSGVO).",
            "Berichtigung unrichtiger Daten (Art. 16 DSGVO).",
            "Löschung (Art. 17 DSGVO) und Einschränkung (Art. 18 DSGVO) im gesetzlichen Rahmen.",
            "Datenübertragbarkeit für von Ihnen bereitgestellte Daten (Art. 20 DSGVO).",
            "Widerspruch gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21 DSGVO).",
            "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft.",
            "Beschwerderecht bei einer Aufsichtsbehörde, insbesondere beim LfDI Baden-Württemberg oder Ihrer lokalen Behörde.",
          ],
        },
        {
          heading: "9. Ausübung Ihrer Rechte",
          paragraphs: [
            "Kontaktieren Sie uns über die untenstehenden Angaben. Zum Schutz Ihrer Daten können wir einen Identitätsnachweis anfordern. Wir antworten ohne unangemessene Verzögerung innerhalb der gesetzlichen Fristen.",
          ],
        },
        {
          heading: "10. Kundenprojekte und Partner-Logos",
          paragraphs: [
            "Im Rahmen meiner professionellen Portfolio-Präsentation stelle ich für Kunden entwickelte Projekte vor und zeige Partner-Logos im Partnerbereich meiner Website.",
            "Diese Darstellung dient als Referenz für potenzielle Kunden, um Qualität und Umfang meiner Arbeit nachzuvollziehen und professionelle Beziehungen zu etablierten Partnern zu zeigen.",
          ],
          bullets: [
            "Projektdarstellung: Mit ausdrücklicher schriftlicher Zustimmung jedes Kunden zeige ich Projektdetails wie Beschreibungen, verwendete Technologien, Screenshots und Projektergebnisse. Kundennamen und Firmeninformationen werden nur mit ausdrücklicher Erlaubnis angezeigt.",
            "Partner-Logos: Firmenlogos von Partnern werden im Partnerbereich nur nach Erhalt ausdrücklicher Genehmigung durch eine schriftliche Vereinbarung oder Vertragsklausel angezeigt. Logos werden ausschließlich zur Darstellung beruflicher Zusammenarbeit verwendet.",
            "Kundenkontrolle: Kunden behalten das Recht, jederzeit die Entfernung oder Änderung ihrer Projektinformationen oder Logos durch direkte Kontaktaufnahme anzufordern. Solche Anfragen werden innerhalb von 7 Werktagen bearbeitet.",
            "Vertrauliche Informationen: Vertrauliche Geschäftsinformationen, proprietärer Code oder sensible Daten werden niemals ohne ausdrückliche schriftliche Genehmigung veröffentlicht. Alle Präsentationsmaterialien durchlaufen vor Veröffentlichung eine Kundenprüfung und -genehmigung.",
            "Rechtsgrundlage: Diese Präsentationsaktivitäten erfolgen gemäß Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Darstellung beruflicher Arbeit), wobei die Kundeneinwilligung stets Vorrang hat.",
          ],
        },
        {
          heading: "11. Aktualisierungen",
          paragraphs: [
            "Wir passen diese Datenschutzerklärung an, sobald sich unsere Dienste oder rechtliche Vorgaben ändern. Die aktuelle Version finden Sie jederzeit unter /privacy.",
          ],
        },
      ],
      contactHeading: "Kontakt für Datenschutzanfragen",
      contactDetails: [
        "Ali Ramazan Yildirim",
        "Anschrift: Hebelstraße 1, 77880 Sasbach, Deutschland",
        "E-Mail: aliramazanyildirim@gmail.com",
        "Telefon: +49 151 67145187",
      ],
      note: "Bei Abweichungen zwischen den Sprachfassungen gilt die englische Version. Verbraucherschutzrechte bleiben unberührt.",
    },
    terms: {
      title: "Allgemeine Geschäftsbedingungen (AGB)",
      lastUpdated: "Stand: 19. Oktober 2025",
      intro: [
        "Diese Allgemeinen Geschäftsbedingungen ('AGB') regeln alle professionellen Softwareentwicklungsdienstleistungen, die von Ramazan Yildirim ('Dienstleister', 'ich') für Auftraggeber ('Kunde', 'Sie') über diese Portfolio-Plattform erbracht werden.",
        "Mit der Beauftragung meiner Leistungen, der Anforderung eines Angebots oder dem Abschluss einer Projektvereinbarung akzeptieren Sie diese AGB vollumfänglich. Diese AGB gelten ergänzend zu individuellen Projektvereinbarungen oder Verträgen.",
      ],
      sections: [
        {
          heading: "1. Leistungsumfang",
          paragraphs: [
            "Ich erbringe professionelle Softwareentwicklungsdienstleistungen, darunter unter anderem:",
          ],
          bullets: [
            "Full-Stack-Webentwicklung (React, Next.js, Node.js, Express, MongoDB)",
            "Frontend-Entwicklung mit modernen Frameworks und Responsive Design",
            "Backend-Entwicklung und API-Integrationen",
            "Enterprise-System-Beratung und SAP/ABAP-Entwicklung",
            "E-Commerce-Lösungen und Zahlungsintegrationen (Stripe, PayPal)",
            "Projektberatung, Architektur-Design und Code-Optimierung",
            "Maßgeschneiderte Softwarelösungen nach Kundenanforderungen",
          ],
        },
        {
          heading: "2. Projektablauf",
          bullets: [
            "Erstberatung: Kunden senden Anfragen über mein Kontaktformular. Ich antworte innerhalb von 2 Werktagen mit erstem Feedback.",
            "Projektangebot: Nach der Beratung erstelle ich ein detailliertes Angebot mit Umfang, Zeitplan (1 Woche bis 6 Monate), Liefergegenständen und Preisen.",
            "Vertragsschluss: Projekte beginnen nach schriftlicher Angebotsannahme und Erhalt der vereinbarten Anzahlung (üblicherweise 30-50%).",
            "Entwicklung: Ich arbeite nach vereinbarten Meilensteinen mit regelmäßigen Fortschrittsberichten und Feedback-Sessions.",
            "Lieferung & Testing: Finale Liefergegenstände durchlaufen eine Kundenprüfung. Ich biete eine Testphase von 7-14 Tagen je nach Projektkomplexität.",
            "Schlusszahlung & Launch: Nach Kundenfreigabe ist die Schlusszahlung vor Projektstart oder Übergabe fällig.",
          ],
        },
        {
          heading: "3. Preise und Zahlungsbedingungen",
          bullets: [
            "Projektpreise: Alle Preise werden in Euro (EUR) angegeben und enthalten die deutsche MwSt. (19%), sofern zutreffend.",
            "Empfehlungsrabatte: Kunden profitieren von meinem Empfehlungsprogramm mit 3%, 6% oder 9% Rabatt je nach Empfehlungsstufe.",
            "Zahlungsplan: Standardzahlungsbedingungen sind 50% Anzahlung, 50% bei Fertigstellung. Bei Projekten über 3 Monate gelten meilensteinbasierte Zahlungen.",
            "Zahlungsmethoden: Ich akzeptiere Banküberweisung (SEPA), PayPal und andere in Rechnungen angegebene Methoden.",
            "Zahlungsverzug: Rechnungen sind innerhalb von 14 Tagen fällig. Bei Verzug fallen Zinsen in Höhe von 5% über Basiszinssatz an (§ 288 BGB).",
            "Zusätzliche Kosten: Kosten für Drittanbieter-Services (Hosting, APIs, Premium-Tools) werden separat berechnet, sofern nicht im Projektangebot enthalten.",
          ],
        },
        {
          heading: "4. Pflichten des Kunden",
          bullets: [
            "Zeitnahe Information: Kunden müssen alle notwendigen Informationen, Zugangsdaten und Materialien innerhalb vereinbarter Fristen bereitstellen.",
            "Feedback & Freigaben: Kunden müssen Liefergegenstände prüfen und Feedback innerhalb vereinbarter Fristen geben (üblicherweise 5-7 Werktage).",
            "Inhaltliche Verantwortung: Kunden sind für die Rechtmäßigkeit aller von ihnen bereitgestellten Inhalte, Texte, Bilder und Materialien verantwortlich.",
            "Mitwirkung: Kunden müssen eine zur Entscheidung befugte Kontaktperson benennen und zeitnahe Rückmeldungen geben.",
            "Drittanbieter-Services: Kunden sind verantwortlich für die Aufrechterhaltung von Lizenzen, Abonnements und Konten für von ihnen genutzte Drittanbieter-Services.",
          ],
        },
        {
          heading: "5. Projektzeitpläne und Verzögerungen",
          bullets: [
            "Geschätzte Zeitpläne: Alle Projektdauerschätzungen (1 Woche - 6 Monate) sind Best-Effort-Prognosen basierend auf dem vereinbarten Umfang.",
            "Kundenseitige Verzögerungen: Verzögerungen durch verspätetes Kundenfeedback, fehlende Materialien oder Umfangsänderungen verlängern Zeitpläne proportional ohne Auswirkung auf meine Verpflichtungen.",
            "Höhere Gewalt: Ich hafte nicht für Verzögerungen durch Umstände außerhalb meiner angemessenen Kontrolle (technische Ausfälle, Drittanbieter-Serviceausfälle, Naturkatastrophen).",
            "Zeitplanverlängerungen: Wesentliche Umfangsänderungen können Zeitplanänderungen und zusätzliche Gebühren erfordern.",
          ],
        },
        {
          heading: "6. Änderungen und Zusatzarbeiten",
          bullets: [
            "Umfangsänderungen: Änderungen am vereinbarten Projektumfang erfordern schriftliche Zustimmung und können zusätzliche Kosten und Zeitplanverlängerungen nach sich ziehen.",
            "Änderungswünsche: Kleinere Änderungen während der Entwicklung werden nach Möglichkeit berücksichtigt. Größere Änderungen werden separat angeboten.",
            "Zusätzliche Features: Features, die nicht im ursprünglichen Umfang enthalten sind, werden als Zusatzarbeit zu unserem Standard-Stundensatz oder projektbasierter Preisgestaltung abgerechnet.",
            "Kundenfreigabe: Alle wesentlichen Änderungen müssen vom Kunden schriftlich genehmigt werden, bevor sie implementiert werden.",
          ],
        },
        {
          heading: "7. Geistige Eigentumsrechte",
          bullets: [
            "Individueller Code: Nach vollständiger Zahlung erhalten Kunden das Eigentum an speziell für ihr Projekt entwickeltem individuellem Code.",
            "Nutzungslizenz: Kunden erhalten eine unbefristete, weltweite Lizenz zur Nutzung aller gelieferten Arbeiten für ihre Geschäftszwecke.",
            "Vorbehaltene Rechte: Ich behalte Rechte an: (a) wiederverwendbaren Code-Bibliotheken und Frameworks, (b) allgemeinen Methoden und Techniken, (c) meinem eigenen vorbestehenden geistigen Eigentum.",
            "Drittkomponenten: Open-Source-Komponenten und Drittanbieter-Bibliotheken unterliegen weiterhin ihren jeweiligen Lizenzen.",
            "Portfolio-Nutzung: Wie in meiner Datenschutzerklärung angegeben, kann ich Projektarbeiten mit Kundenzustimmung präsentieren. Kunden können jederzeit Entfernung beantragen.",
            "Vertraulichkeit: Ich wahre die Vertraulichkeit von Kundengeschäftsinformationen und gebe proprietären Code oder sensible Daten ohne Genehmigung nicht weiter.",
          ],
        },
        {
          heading: "8. Qualitätssicherung und Testing",
          bullets: [
            "Qualitätsstandards: Alle Liefergegenstände entsprechen professionellen Branchenstandards und vereinbarten Spezifikationen.",
            "Browser-Kompatibilität: Web-Projekte werden auf gängigen Browsern (Chrome, Firefox, Safari, Edge) in aktueller und vorheriger Hauptversion getestet.",
            "Responsive Design: Projekte umfassen Responsive Design für Desktop, Tablet und Mobilgeräte, sofern nicht ausdrücklich ausgeschlossen.",
            "Testphase: Kunden haben 7-14 Tage nach Lieferung Zeit, Probleme zu melden. Ich behebe Fehler, die in dieser Zeit entdeckt werden, ohne zusätzliche Kosten.",
            "Fehlerbehebung: Kritische Fehler mit Auswirkung auf Kernfunktionalität werden priorisiert. Kleinere UI-Probleme werden nach Verfügbarkeit behoben.",
          ],
        },
        {
          heading: "9. Gewährleistung und Haftungsbeschränkungen",
          bullets: [
            "Funktionsgewährleistung: Ich gewährleiste, dass gelieferte Arbeiten für 30 Tage nach Lieferung im Wesentlichen wie in der Projektdokumentation beschrieben funktionieren.",
            "Keine Erfolgsgarantie: Ich garantiere keine spezifischen Geschäftsergebnisse, Umsätze, Traffic, Conversions oder SEO-Rankings.",
            "Drittanbieter-Services: Ich hafte nicht für Ausfälle, Änderungen oder Einstellung von Drittanbieter-Services (APIs, Hosting, Zahlungsdienstleister).",
            "Browser-/Plattformänderungen: Ich hafte nicht für Funktionsänderungen durch Browser-Updates, Plattformänderungen oder veraltete Technologien.",
            "Kundenmodifikationen: Die Gewährleistung erlischt, wenn Kunden gelieferten Code ohne meine Konsultation modifizieren.",
          ],
        },
        {
          heading: "10. Support und Wartung",
          bullets: [
            "Initialer Support: 30 Tage E-Mail-Support nach Lieferung für Fragen und kleinere Anpassungen sind enthalten.",
            "Erweiterter Support: Laufende Wartung, Hosting-Management und Feature-Updates sind über separate Wartungsvereinbarungen verfügbar.",
            "Reaktionszeiten: Support-Anfragen werden innerhalb von 1-2 Werktagen bestätigt. Lösungszeit hängt von Problemkomplexität ab.",
            "Separate Gebühren: Support über die initialen 30 Tage hinaus wird stundenweise oder über monatliche Wartungspakete abgerechnet.",
          ],
        },
        {
          heading: "11. Haftung und Freistellung",
          bullets: [
            "Haftungsobergrenze: Meine Gesamthaftung für alle Ansprüche aus einem Projekt ist auf die für dieses Projekt gezahlten Gesamtgebühren begrenzt.",
            "Ausschlüsse: Ich hafte nicht für indirekte, Folge- oder besondere Schäden einschließlich entgangener Gewinne, Datenverlust oder Geschäftsunterbrechung.",
            "Kundenfreistellung: Kunden stellen mich frei von Ansprüchen aus: (a) von ihnen bereitgestellten Inhalten, (b) ihrer Nutzung gelieferter Arbeiten, (c) Verletzung von Rechten Dritter, (d) Nichteinhaltung geltender Gesetze.",
            "Deutsches Recht: Die maximale Haftung folgt den gesetzlichen deutschen Grenzen (§ 521 BGB für Schenkungselemente, § 619a BGB für Dienstverträge).",
          ],
        },
        {
          heading: "12. Vertraulichkeit und Datenschutz",
          bullets: [
            "Vertrauliche Informationen: Beide Parteien verpflichten sich, während des Projekts ausgetauschte vertrauliche Informationen streng vertraulich zu behandeln.",
            "Datenschutz: Die Verarbeitung personenbezogener Daten erfolgt gemäß meiner Datenschutzerklärung und DSGVO-Anforderungen.",
            "Sicherheitsmaßnahmen: Ich implementiere branchenübliche Sicherheitsmaßnahmen zum Schutz von Kundendaten und Projektmaterialien.",
            "Datenaufbewahrung: Projektdateien und Kommunikation werden 3 Jahre nach Projektabschluss für rechtliche und Gewährleistungszwecke aufbewahrt.",
          ],
        },
        {
          heading: "13. Kündigung und Stornierung",
          bullets: [
            "Kundenkündigung: Kunden können Projekte mit 14 Tagen schriftlicher Frist kündigen. Bis zum Kündigungsdatum abgeschlossene Arbeiten müssen vollständig bezahlt werden.",
            "Dienstleisterkündigung: Ich kann Projekte kündigen, wenn: (a) Kunde Zahlungsbedingungen verletzt, (b) Kunde Pflichten nicht erfüllt, (c) Projekt undurchführbar wird.",
            "Einvernehmliche Kündigung: Projekte können durch gegenseitige schriftliche Vereinbarung mit fairer Abrechnung abgeschlossener Arbeiten beendet werden.",
            "Kündigungsfolgen: Bei Kündigung erhalten Kunden alle abgeschlossenen Arbeitslieferungen und zahlen für bis dahin abgeschlossene Arbeiten.",
            "Rückerstattungen: Anzahlungen sind nicht erstattungsfähig, außer wenn ich vereinbarte Leistungen nicht erbringe oder ohne Grund kündige.",
          ],
        },
        {
          heading: "14. Streitbeilegung",
          bullets: [
            "Gutgläubige Verhandlung: Parteien verpflichten sich, zunächst eine Lösung durch gutgläubige Verhandlung anzustreben.",
            "Mediation: Scheitert die Verhandlung, vereinbaren Parteien, vor rechtlichen Schritten eine Mediation zu versuchen.",
            "Anwendbares Recht: Diese AGB unterliegen deutschem Recht unter Ausschluss des UN-Kaufrechts (CISG).",
            "Gerichtsstand: Ausschließlicher Gerichtsstand ist Offenburg, Deutschland (nächstgelegen zu 77880 Sasbach).",
            "Sprache: Im Streitfall hat die deutsche Version dieser AGB Vorrang.",
          ],
        },
        {
          heading: "15. Allgemeine Bestimmungen",
          bullets: [
            "Gesamtvereinbarung: Diese AGB bilden zusammen mit individuellen Projektvereinbarungen die Gesamtvereinbarung zwischen den Parteien.",
            "Änderungen: Änderungen dieser AGB erfordern schriftliche Vereinbarung. Projektspezifische Änderungen beeinflussen diese allgemeinen AGB nicht.",
            "Salvatorische Klausel: Sollte eine Bestimmung unwirksam sein, bleiben die übrigen Bestimmungen voll wirksam.",
            "Abtretung: Kunden dürfen Projektvereinbarungen nicht ohne unsere schriftliche Zustimmung abtreten. Wir können mit angemessener Benachrichtigung abtreten.",
            "Höhere Gewalt: Keine Partei haftet für Nichterfüllung aufgrund von Umständen außerhalb angemessener Kontrolle.",
            "Fortbestand: Bestimmungen zu geistigem Eigentum, Vertraulichkeit, Zahlung und Haftung überdauern Projektabschluss oder Kündigung.",
          ],
        },
        {
          heading: "16. Empfehlungsprogramm-Bedingungen",
          bullets: [
            "Berechtigung: Kunden, die neue Kunden empfehlen, erhalten Rabatte auf ihre eigenen Projekte: 3% (1. Empfehlung), 6% (2.), 9% (3.+).",
            "Gültige Empfehlungen: Empfehlungen müssen zu abgeschlossenen bezahlten Projekten führen. Rabatte gelten für das nächste Projekt des empfehlenden Kunden.",
            "Kein Barwert: Empfehlungsrabatte haben keinen Barwert und können nicht übertragen oder mit anderen Aktionen kombiniert werden.",
            "Programmänderungen: Ich behalte mir vor, das Empfehlungsprogramm mit 30 Tagen Frist an aktive Teilnehmer zu ändern oder zu beenden.",
          ],
        },
      ],
      contactHeading: "Fragen zu diesen AGB?",
      contactDetails: [
        "Ramazan Yildirim",
        "Softwareentwicklungsdienstleistungen",
        "Anschrift: Hebelstraße 1, 77880 Sasbach, Deutschland",
        "E-Mail: aliramazanyildirim@gmail.com",
        "Telefon: +49 151 67145187",
      ],
      note: "Diese AGB werden in Englisch, Deutsch und Türkisch bereitgestellt. Bei Abweichungen hat die deutsche Version für Kunden in Deutschland/EU Vorrang, vorbehaltlich zwingender Verbraucherschutzgesetze.",
    },
    solutions: {
      leadGeneration: {
        slug: "lead-generation-websites",
        title: "Websites, die Anfragen bringen",
        subtitle: "Besucher in Chancen verwandeln",
        hero: {
          headline: "Ihre Website als Verkaufsmaschine",
          description: "Jede Seite, jedes Wort, jede Interaktion ist darauf ausgerichtet, die Aufmerksamkeit zu erregen und Besucher in Entscheidungsträger zu verwandeln.",
          cta: "Leads ab sofort einfangen",
        },
        features: [
          {
            title: "Konversionsoptimierte Texte",
            description: "Jedes Wort ist darauf gewählt, Reibungsverluste zu reduzieren und Besucher zu handeln zu bewegen.",
            icon: "✨",
          },
          {
            title: "Smarte Lead-Formulare",
            description: "Intelligente Formulare, die genau die richtigen Informationen zum richtigen Zeitpunkt erfassen.",
            icon: "📋",
          },
          {
            title: "Vertrauenssignale",
            description: "Testimonials und Zertifikate platziert, um Kaufbedenken zu überwinden.",
            icon: "⭐",
          },
        ],
        testimonial: {
          quote: "In den ersten drei Monaten verzeichneten wir einen Anstieg der qualifizierten Leads um 45 %.",
          author: "Sarah K.",
          role: "B2B SaaS Gründerin",
          metric: "+45% Leads",
        },
        pricing: [
          {
            name: "Starter",
            price: "€2.500",
            features: ["Bis zu 5 Seiten", "Lead-Formular", "Mobile-freundlich", "Basis-Analyse"],
          },
          {
            name: "Professional",
            price: "€5.500",
            features: ["Bis zu 15 Seiten", "Erweiterte Formulare", "CRM-Integration", "A/B-Tests"],
            highlight: true,
          },
          {
            name: "Enterprise",
            price: "Individuell",
            features: ["Unbegrenzte Seiten", "Vollständige Automatisierung", "Benutzerdefinierte Integrationen", "Dedizierten Account"],
          },
        ],
      },
      performanceSeo: {
        slug: "performance-seo",
        title: "Schnellere Seiten & bessere Sichtbarkeit",
        subtitle: "Geschwindigkeit und Sichtbarkeit, die Ergebnisse liefert",
        hero: {
          headline: "Schnell genug zum Gewinnen, sichtbar genug um gefunden zu werden",
          description: "Eine Seite, die in 1 Sekunde lädt, konvertiert 7x besser. Wir bauen für Geschwindigkeit und SEO.",
          cta: "Steigern Sie Ihre Site-Geschwindigkeit",
        },
        features: [
          { title: "Core Web Vitals Optimiert", description: "LCP, FID, CLS—optimiert für Google Metriken.", icon: "⚡" },
          { title: "SEO-Architektur", description: "Strukturierte Daten und interne Verlinkung für sofortige Sichtbarkeit.", icon: "🔍" },
          { title: "Performance-Überwachung", description: "Echtzeit-Dashboards zur Überwachung von Geschwindigkeit und Sichtbarkeit.", icon: "📊" },
        ],
        testimonial: { quote: "Site-Geschwindigkeit verbessert sich von 4,2s auf 1,1s. Organischer Traffic +62% in 4 Monaten.", author: "Michael T.", role: "E-Commerce Manager", metric: "+62% organic" },
        pricing: [
          { name: "Speed-Audit", price: "€500", features: ["Vollständige Analyse", "Engpass-Identifikation", "Optimierungsplan"] },
          { name: "Performance-Sprint", price: "€3.500", features: ["Vollständige Optimierung", "Image CDN", "Code Splitting"], highlight: true },
          { name: "SEO & Performance", price: "€6.000", features: ["Vollständiges SEO", "Technisches Audit", "Schema Markup"] },
        ],
      },
      ecommerceSolutions: {
        slug: "ecommerce-solutions",
        title: "Online-Shop Einrichtung",
        subtitle: "Von Null zu profitablen Verkäufen",
        hero: {
          headline: "Ihr Geschäft automatisiert und optimiert",
          description: "Mehr als Produkte und Preise. Es geht um Vertrauen, Bequemlichkeit und das Entfernen aller Gründe zum Gehen.",
          cta: "Starten Sie Ihren Shop",
        },
        features: [
          { title: "Produktverwaltung", description: "Intuitive Admin. Produkte hochladen, Bestand verwalten, Preise setzen.", icon: "🛍️" },
          { title: "Zahlungsintegration", description: "Stripe, PayPal und mehr. PCI-konform. Checkout optimiert.", icon: "💳" },
          { title: "Erfüllungsbereitschaft", description: "Bestellverfolgung, Versandintegrationen, Kundenmitteilungen.", icon: "📦" },
        ],
        testimonial: { quote: "Reduzierte Gebühren um 40% bei vollständiger Kontrolle über unseren Shop.", author: "Elena M.", role: "Fashion Brand Eigentümer", metric: "40% Gebührenreduktion" },
        pricing: [
          { name: "Wesentlicher Shop", price: "€4.000", features: ["Bis zu 50 Produkte", "Basis-Bestand", "Zahlungsabwicklung"] },
          { name: "Wachstums-Shop", price: "€8.000", features: ["Unbegrenzte Produkte", "Erweiterter Bestand", "Email-Automatisierung"], highlight: true },
          { name: "Unternehmens", price: "Individuell", features: ["Multi-Channel", "Großhandel", "Abonnements"] },
        ],
      },
      cmsManagement: {
        slug: "cms-management",
        title: "Einfach Inhalte bearbeiten",
        subtitle: "Aktualisieren Sie Ihre Site ohne Entwickler",
        hero: {
          headline: "Ihre Inhalte, Ihre Regeln. Kein Code erforderlich.",
          description: "Ein CMS, das sich natürlich anfühlt. Veröffentlichen Sie Beiträge, aktualisieren Sie Seiten—alles von einer Schnittstelle.",
          cta: "Befähigen Sie Ihr Team",
        },
        features: [
          { title: "Visueller Editor", description: "WYSIWYG-Schnittstelle für nicht-technische Teamkollegen.", icon: "✏️" },
          { title: "Inhaltsplanung", description: "Planen Sie Inhalte Wochen im Voraus. Auto-Veröffentlichung zu optimalen Zeiten.", icon: "📅" },
          { title: "Teamzusammenarbeit", description: "Multi-Benutzer-Rollen, Berechtigungen und Genehmigungsworkflows.", icon: "👥" },
        ],
        testimonial: { quote: "Marketingteam veröffentlicht Änderungen sofort. Produktivität sprunghaft gestiegen.", author: "David P.", role: "Marketing Director", metric: "5x schneller" },
        pricing: [
          { name: "Einfaches CMS", price: "€1.500", features: ["5 Inhaltstypen", "Basis-Editor", "1-3 Benutzer"] },
          { name: "Team-CMS", price: "€3.500", features: ["Unbegrenzte Typen", "Visueller Editor", "10+ Benutzer"], highlight: true },
          { name: "Erweitert", price: "€6.500", features: ["Benutzerdefinierte Felder", "Webhooks", "Versionskontrolle"] },
        ],
      },
      analyticsTracking: {
        slug: "analytics-tracking",
        title: "Wichtiges messen",
        subtitle: "Datengetriebene Einblicke in Ihre Site",
        hero: {
          headline: "Sehen Sie, was funktioniert. Beheben Sie, was nicht.",
          description: "Rohe Daten sind keine Einblicke. Wir stellen Analysen auf, die echte Fragen über Besucher beantworten.",
          cta: "Bekommen Sie Klarheit",
        },
        features: [
          { title: "Ziel-Tracking", description: "Nachverfolgung von Einsendungen, Käufen, Anmeldungen. Wissen Sie, welche Kanäle echten Wert fahren.", icon: "🎯" },
          { title: "Verhaltenseinblicke", description: "Heatmaps, Sitzungsaufzeichnungen. Sehen Sie genau, wie Besucher interagieren.", icon: "👀" },
          { title: "Benutzerdefinierte Dashboards", description: "Monatliche Berichte, die das Wichtigste hervorheben. Umsetzbar, nicht überwältigend.", icon: "📈" },
        ],
        testimonial: { quote: "Verstand endlich, welche Seiten Konvertierungen fahren. Verdoppelte unsere Konversionsrate.", author: "Jessica L.", role: "Startup Founder", metric: "2x Konversionsrate" },
        pricing: [
          { name: "Grundlegend", price: "€300/Monat", features: ["Basis-Tracking", "Monatliche Berichte", "Ziel-Setup"] },
          { name: "Pro", price: "€800/Monat", features: ["Erweitertes Tracking", "Heatmaps", "Sitzungsaufzeichnungen"], highlight: true },
          { name: "Analytics+", price: "€1.500/Monat", features: ["Alles in Pro", "A/B-Tests", "24/7-Support"] },
        ],
      },
      teamTraining: {
        slug: "team-training",
        title: "Übergabe & Team-Training",
        subtitle: "Befähigen Sie Ihr Team zur Site-Verwaltung",
        hero: {
          headline: "Wissenstransfer, der bleibt",
          description: "Eine Übergabe, die funktioniert. Video-Walkthroughs, schriftliche Leitfäden, Live-Q&A-Sitzungen.",
          cta: "Investieren Sie in Ihr Team",
        },
        features: [
          { title: "Umfassende Dokumentation", description: "Schritt-für-Schritt-Anleitungen und Video-Tutorials für jede Rolle.", icon: "📚" },
          { title: "Live-Trainings-Sitzungen", description: "On-site oder Remote-Workshops für alles vom täglichen Handling bis zur erweiterten Konfiguration.", icon: "🎓" },
          { title: "Laufende Unterstützung", description: "Dedizierter Support-Kanal für Fragen. Wir sind für Sie da.", icon: "🤝" },
        ],
        testimonial: { quote: "Das Training war unglaublich umfassend. Unser gesamtes Team fühlte sich sofort zuversichtlich.", author: "Thomas R.", role: "Operations Manager", metric: "100% Vertrauen" },
        pricing: [
          { name: "Standard", price: "€2.000", features: ["Schriftliche Leitfäden", "Video-Tutorials", "1 Live-Sitzung"] },
          { name: "Premium", price: "€4.500", features: ["Alles im Standard", "2-tägiges Training", "30-Tage-Support"], highlight: true },
          { name: "Erweiterte Unterstützung", price: "€1.200/Monat", features: ["Monatliches Training", "Dedizierter Kanal", "Strategische Führung"] },
        ],
      },
    },
  },
  tr: {
    nav: {
      languageMenu: {
        label: "Dil",
        languages: {
          en: "İngilizce",
          de: "Almanca",
          tr: "Türkçe",
        },
      },
      aria: {
        toggle: "Menüyü aç/kapat",
        close: "Menüyü kapat",
        language: "Dil seç",
      },
      items: [
        {
          title: "<Çözümler>",
          submenu: trSolutions,
        },
        { title: "<Hakkımda>", path: "/about" },
        { title: "<Projeler>", path: "/projects" },
        { title: "<İletişim>", path: "/#contact" },
        {
          title: "<Blog>",
          path: "https://medium.com/@aliramazanyildirim",
          external: true,
        },
        { title: "<Admin>", path: "/admin/login" },
      ],
      solutions: {
        label: "Çözümler",
        items: trSolutions,
      },
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Git",
      scrollTopAria: "Yukarı kaydır",
      privacyLink: "Gizlilik Politikası",
      privacyAria: "Gizlilik politikası sayfasını aç",
      termsLink: "Hizmet Şartları",
      termsAria: "Hizmet şartları sayfasını aç",
    },
    hero: {
      tagline: "Belirsizliğe yer yok",
      headline: {
        leading: "İdeal müşterilerinizi ve ekibinizi etkileyen",
        highlight: "güven veren web sitesi",
        trailing: "ile büyümeyi hızlandırın",
      },
      subheadline:
        "Strateji, içerik, tasarım ve geliştirmeyi tek süreçte bir araya getiren kıdemli bir full-stack geliştirici ile doğrudan çalışın.",
      introParagraphs: [
        "Onboarding atölyesiyle değer önerinizi, hedef kitlenizin sorunlarını ve dönüşüm noktalarını keşfediyorum. Bu içgörüler mesajlaşmayı, UX'i ve teknik altyapıyı kod yazmadan önce şekillendiriyor.",
        "Ardından haftalık prototipler, şeffaf durum güncellemeleri ve lansmana hazır varlıklar teslim ediyorum; böylece pazarlama ekibiniz kesintisiz ilerleyebiliyor.",
      ],
      valueProps: [
        {
          title: "Uçtan uca teslimat",
          description:
            "Discovery, metin yazımı, tasarım, geliştirme, test ve analitik — tek sorumlu ortak tarafından yönetilir.",
        },
        {
          title: "Doğrudan kıdemli destek",
          description:
            "Tüm süreçte yalnızca benimle çalışırsınız; junior devri yok, ajans karmaşası yok, hedeflerinize uygun kararlar var.",
        },
        {
          title: "Dönüşüm odaklı yapı",
          description:
            "Hızlı, güvenli Next.js altyapısı, net içerik hiyerarşisi ve en baştan kurulu ölçümleme ile gelir.",
        },
        {
          title: "Şeffaf yatırım",
          description:
            "Sabit kapsamlı paketler, net zaman çizelgesi ve proaktif iletişim sayesinde her adımı önceden bilirsiniz.",
        },
      ],
      ctas: {
        primary: {
          label: "Ücretsiz keşif görüşmesi ayarla",
          href: "/#contact",
        },
        secondary: { label: "Sürecin nasıl ilerlediğini gör" },
      },
      trustNote: "24 saat içinde size özel bir aksiyon planıyla dönüş yaparım.",
      location: "Sasbach'tan remote · Avrupa ve Türkiye'deki işletmelerle",
      scrollLabel: "Daha fazlası için kaydır",
      processModal: {
        title: "Momentum Yol Haritası",
        subtitle:
          "Her aşama karar vericileri aynı masada tutar, somut ilerleme gösterir ve lansman sürecindeki belirsizliği ortadan kaldırır.",
        closeLabel: "Genel bakışı kapat",
        steps: [
          {
            stage: "Aşama 01",
            title: "Keşif ve Strateji Mimarisi",
            description:
              "İş modelinizi, müşteri motivasyonlarını ve başarı metriklerini derinlemesine analiz ederek her tasarım kararının ölçülebilir sonuçlara hizmet etmesini sağlıyorum.",
            highlights: [
              "Hedefleri, kısıtları ve satın alma tetikleyicilerini çıkaran yönetici atölyesi.",
              "Hedef kitle haritası, rakip analizi ve SEO sinyali değerlendirmesi.",
              "Milestone'ları, sorumluları, bütçeyi ve KPI'ları içeren deneyim yol haritası.",
            ],
            duration: "Zaman çizelgesi: 3–5 gün",
            outcome: "Sonuç: Paylaşılan stratejik plan ve önceliklendirilmiş backlog.",
          },
          {
            stage: "Aşama 02",
            title: "Mesajlaşma ve Deneyim Taslağı",
            description:
              "Konumlandırmayı net metinlere, UX akışlarına ve içeriği yönlendiren bilgi mimarisine dönüştürüyorum.",
            highlights: [
              "Değer önerisini ikna edici hikâyeye dönüştüren mesaj çerçevesi.",
              "Bilgi mimarisi, kullanıcı akışları ve interaktif prototip turu.",
              "Mood, tipografi ve bileşen dilini kapsayan görsel yön tahtası.",
            ],
            duration: "Zaman çizelgesi: 5–7 gün",
            outcome: "Sonuç: Üretime hazır onaylı prototip ve içerik planı.",
          },
          {
            stage: "Aşama 03",
            title: "Tasarım, Geliştirme ve Kalite Mühendisliği",
            description:
              "Tasarım sistemi, animasyonlar ve yüksek performanslı kod paralel ilerleyerek lansman varlıklarının tamamı üretime hazır hale gelir.",
            highlights: [
              "Yeniden kullanılabilir bölümler, durumlar ve mikro etkileşimler içeren duyarlı tasarım sistemi.",
              "Performans, erişilebilirlik ve SEO temellerine sahip Next.js geliştirme.",
              "Cihaz testleri ve otomasyon içeren kalite güvence sprintleri.",
            ],
            duration: "Zaman çizelgesi: 2–3 hafta",
            outcome: "Sonuç: Analitik ve CMS bağlantıları kurulmuş lansman hazır deneyim.",
          },
          {
            stage: "Aşama 04",
            title: "Lansman, Eğitim ve Büyüme Hazırlığı",
            description:
              "Yayın planını, ekip eğitimini ve ölçüm araçlarını organize ederek lansman sonrasında da ivmenin devam etmesini sağlıyorum.",
            highlights: [
              "Rollback planı, izleme ve başarı kontrol listesi içeren lansman runbook'u.",
              "Sürekli güncellemeler için eğitim oturumları ve video walkthrough'lar.",
              "Analitik, ısı haritaları ve lead içgörülerini birleştiren büyüme panosu.",
            ],
            duration: "Zaman çizelgesi: 3–5 gün",
            outcome: "Sonuç: Güvenli lansman ve sürekli optimizasyona hazır yol haritası.",
          },
        ],
        finalNote:
          "Lansmandan sonra da growth sprintleri, dönüşüm testleri ve yeni özellik yayınlarında aynı şeffaf tempo ile yanınızda oluruz.",
        navigation: {
          previous: "Önceki aşama",
          next: "Sonraki aşama",
          jumpTo: "Aşama seç",
          progress: "İlerleme",
        },
      },
    },
    littleAbout: {
      heading: "Biraz Benim Hakkımda  -",
      paragraphOne:
        "JavaScript, Node.js, Next.js, React, Blazor ve .NET Core gibi modern web teknolojilerinde geniş deneyime sahip bir Full-Stack Yazılım Geliştiricisiyim. E-ticaret platformları, mikro servisler ve blog uygulamaları üzerine çalışmalarım sayesinde ölçeklenebilir yazılım mimarilerine ve en iyi uygulamalara odaklandım. Arka planım, uygulamalı geliştirme, problem çözme ve web uygulamalarında performans optimizasyonunu içeriyor.",
      paragraphTwo:
        "JavaScript, C#, TypeScript, React ve Next.js — teknolojiyi kullanarak gerçek çözümler üretmek. İş birliğine açık ortamlarda çalışmayı seviyorum, becerilerimi geliştirmeye ve değer katan çözümler üretmeye sürekli devam ediyorum.",
      cta: "(Hakkımda daha fazlası)",
    },
    littleProjects: {
      heading: "PROJELERİM",
      loadingTitle: "PROJELERİM",
      featuredBadge: "Öne Çıkan Proje",
      emptyTitle: "Henüz proje yok",
      emptyDescription: "İlk projeni eklemek için yukarıdaki butona tıkla.",
      showAll: "Tüm projeleri göster",
      loadingMessage: "Projeler yükleniyor...",
      mobileShowcase: {
        featured: "Öne çıkan",
      },
    },
    partners: {
      strapline: "Birlikte daha güçlüyüz",
      heading: "İş ortaklarımız",
    },
    contact: {
      headingLineOne: "Bana fikrinizi anlatın;",
      headingLineTwo: "size şaşırtıcı bir şey yapayım.",
      placeholders: {
        name: "Ad",
        email: "E-Posta",
        message: "Mesaj",
      },
      submit: "Mesaj gönder",
      success: "Mesajın başarıyla gönderildi. Teşekkürler!",
      toastSending: "Mesaj gönderiliyor...",
      toastSuccess: "Mesaj başarıyla gönderildi.",
      toastEmailError:
        "Bildirim e-postası gönderilemedi ancak mesaj kaydedildi.",
      toastErrorFallback:
        "Bir hata oluştu. Lütfen daha sonra tekrar dene.",
    },
    contactInfo: {
      badge: "Doğrudan hat",
      availability: "Hafta içi 09:00–17:00 CET arasında ulaşılabilir",
    },
    aboutPage: {
      headline: [
        "YARI ZAMANLI",
        "TÜRK KAHVESİ,",
        "TAM ZAMANLI",
        "KODLAMAAAA !",
      ],
      quote:
        '"Teknolojiye olan tutkumla büyürken, yazılım geliştirmeyi her zaman hızla gelişen, dinamik ve olanaklarla dolu dijital dünyanın bir yansıması olarak gördüm. İnovasyonun ilerlemeyi tetiklediği gibi, kodlama da uyum sağlama, problem çözme ve kalıcı çözümler üretmeyle ilgilidir. Her zorluk bir büyüme fırsatı, her aksilik bir ders ve her başarı yeni bir dönüm noktasıdır. Dijital dünyayı bir satır kodla  öğrenmeye, şekillendirmeye ve geliştirmeye devam etmekten heyecan duyuyorum."',
      sectionHeading: "-Ama benimle ilgili daha fazlası var",
      interests: [
        {
          icon: "/icons/coffee.svg",
          alt: "Kahve Simgesi",
          title: "Kahve Tutkunu",
          description:
            "Türk çayı ve menengiç kahvesini seviyorum; gittiğim her sıcak kafede ve geleneksel çay evinde bu lezzetlerin tadını çıkarırım.",
        },
        {
          icon: "/icons/lego.svg",
          alt: "Lego Simgesi",
          title: "Bisiklet ve Robotik Meraklısı",
          description:
            "Çay içmediğim zamanlarda beni sokaklarda bisiklet sürerken ya da LEGO parçalarıyla robotik projeler yaparken bulabilirsiniz.",
        },
        {
          icon: "/icons/compass.svg",
          alt: "Pusula Simgesi",
          title: "Keşif Tutkunu",
          description:
            "Boş zamanlarımda doğayı keşfetmeyi, gizli patikaları ve manzaraları bulmayı seviyorum. Her yolculuk bir macera ve yeni tatlar denemek çok keyifli!",
        },
      ],
    },
    projectsPage: {
      heading: "Projeler",
      projectLabelSingular: "Proje",
      projectLabelPlural: "proje",
      projectsLoading: "Projeler yükleniyor...",
      retry: "Tekrar dene",
      featured: "Öne çıkan",
      noneTitle: "Henüz proje yok",
      noneDescription: "İlk projeni eklemek için yukarıdaki butona tıkla.",
      paginationInfo: {
        pageLabel: "Sayfa",
        separator: "/",
      },
      resultsSuffix: "bulundu",
      loadError: "Projeler yüklenemedi.",
      connectionError: "Projeler yüklenirken bağlantı hatası oluştu.",
    },
    projectDetail: {
      loading: "Proje yükleniyor...",
      notFoundTitle: "Proje bulunamadı",
      notFoundAction: "Projeler sayfasına dön",
      featuredBadge: "Öne Çıkan Proje",
      aboutHeading: "Proje Hakkında",
      role: "Projede Rol",
      duration: "Süre",
      category: "Kategori",
      galleryHeading: "Proje Galerisi",
      technologiesHeading: "Kullanılan Teknolojiler",
      tagsHeading: "Etiketler",
      previous: "Önceki",
      next: "Sonraki",
      indexFallback: "Projeler",
      authorPrefix: "",
      dateLocale: "tr-TR",
      loadError: "Proje yüklenirken bir hata oluştu.",
      durationLabels: {
        "1 Week": "1 Hafta",
        "2 Weeks": "2 Hafta",
        "3 Weeks": "3 Hafta",
        "4 Weeks": "4 Hafta",
        "1 Month": "1 Ay",
        "2 Months": "2 Ay",
        "3 Months": "3 Ay",
        "4 Months": "4 Ay",
        "5 Months": "5 Ay",
        "6 Months": "6 Ay",
      },
      roleLabels: {
        "Full Stack Developer": "Full Stack Geliştirici",
        Developer: "Geliştirici",
        Designer: "Tasarımcı",
        "Project Manager": "Proje Yöneticisi",
      },
      categoryLabels: {
        "Web Development": "Web Geliştirme",
        "Mobile App Development": "Mobil Uygulama Geliştirme",
        "UI/UX Design": "UI/UX Tasarım",
        "E-Commerce": "E-Ticaret",
        Consulting: "Danışmanlık",
      },
    },
    pagination: {
      nextAria: "Sonraki sayfa",
      prevAria: "Önceki sayfa",
      info: ({ current, total, start, end, overall }: {
        current: number;
        total: number;
        start: number;
        end: number;
        overall: number;
      }) => `Sayfa ${current} / ${total} (${start}-${end} / ${overall})`,
    },
    admin: {
      login: {
        title: "Admin Girişi",
        subtitle: "Admin paneline erişmek için giriş yap",
        emailLabel: "E-posta Adresi",
        passwordLabel: "Şifre",
        emailPlaceholder: "admin@example.com",
        passwordPlaceholder: "••••••••",
        signIn: "Giriş Yap",
        signingIn: "Giriş yapılıyor...",
        errorAllFields: "Tüm alanlar zorunlu",
        errorLoginFailed: "Giriş başarısız",
        errorConnection: "Bağlantı hatası",
        checkingSession: "Oturum kontrol ediliyor...",
        footerNote: "Sadece yetkili yöneticiler için",
        backToHome: "← Ana sayfaya dön",
      },
    },
    privacy: {
      title: "Gizlilik Politikası",
      lastUpdated: "Güncelleme tarihi: 17 Ekim 2025",
      intro: [
        "Bu gizlilik politikası, dev-portfolio uygulaması, API'leri ve bağlantılı hizmetlerle etkileşimde bulunduğunuzda kişisel verileri nasıl işlediğimi açıklamaktadır.",
        "Uygulama çok dilli içerik (İngilizce, Almanca, Türkçe) sunmaktadır ve öncelikle Almanya, AB ve Türkiye'de bulunan müşteriler için tasarlanmıştır. Mümkün olan her durumda, AB Genel Veri Koruma Yönetmeliği (GDPR) ve geçerli Alman yasalarına uyum sağlıyoruz.",
      ],
      sections: [
        {
          heading: "1. Veri Sorumlusu",
          paragraphs: [
            "Veri sorumlusu: Ali Ramazan Yıldırım, Hebelstraße 1, 77880 Sasbach, Almanya, e-posta: aliramazanyildirim@gmail.com, telefon: +49 151 67145187, burada açıklanan tüm işlemlerin denetleyicisi olarak görev yapmaktadır.",
            "AB/AEA sakinleri, taleplerini talep üzerine Almanca yazışma adresimize de iletebilirler; yasal süreler içinde cevap vereceğiz.",
          ],
        },
        {
          heading: "2. İşlediğimiz Kişisel Veriler",
          paragraphs: [
            "Yalnızca sizin aktif olarak sağladığınız veya bu portföyü işletmek için teknik olarak gerekli olan verileri işliyoruz.",
          ],
          bullets: [
            "İletişim formu (/api/contact) üzerinden gönderilen ad, e-posta ve mesaj içeriği; MongoDB veritabanımızda zaman damgası ve hız sınırlama metadataları ile birlikte saklanır.",
            "Yönetici paneli (/api/admin/customers) aracılığıyla oluşturulan müşteri kayıtları: ad-soyad, şirket, posta adresi, telefon, e-posta, referans kodları, proje notları, fiyat bilgileri, discountRate, finalPrice, referralCount ve zaman damgaları.",
            "ReferralTransaction kayıtlarıyla tutulan referans programı verileri: referrerCode, %3/%6/%9 indirim seviyeleri, referral level ve ilişkili müşteri kimliği.",
            "InvoiceService ile oluşturulan faturalar kapsamında üretilen bilgiler: fatura numarası, teslimatlar, proje açıklamaları, KDV hesaplamaları ve ödeme referansları.",
            "Yönetici kimlik doğrulaması için kullanılan veriler (e-posta, hashlenmiş şifre, httpOnly 'admin-auth-token' çerezi olarak saklanan oturum belirteci).",
            "Hizmeti güvenceye almak için gerekli olan IP adresi (hız sınırlayıcı anahtarında kısa süre tutulur), tarayıcı başlıkları ve sunucu günlükleri gibi teknik metaveriler.",
          ],
        },
        {
          heading: "3. Amaçlar ve Hukuki Dayanaklar",
          bullets: [
            "İletişim taleplerine yanıt vermek ve teklif hazırlamak (GDPR m.6/1-b).",
            "Müşteri hesaplarını, referans ödüllerini ve proje teslimatlarını yönetmek (GDPR m.6/1-b ve m.6/1-f).",
            "Fatura oluşturmak ve yasal muhasebe yükümlülüklerini yerine getirmek (GDPR m.6/1-c).",
            "Nodemailer aracılığıyla referans bildirimleri ve hatırlatmaları göndermek (meşru menfaat, GDPR m.6/1-f).",
            "Hatalı kullanımı önlemek, hız limitlerini uygulamak ve sistemlerimizi korumak (meşru menfaat, GDPR m.6/1-f).",
            "Yasal yükümlülüklere veya resmi taleplere uymak (GDPR m.6/1-c).",
          ],
        },
        {
          heading: "4. Saklama Süreleri",
          bullets: [
            "İletişim talepleri, tamamlandıktan sonra en fazla 12 ay tutulur; yeni bir sözleşme doğarsa süre uzayabilir.",
            "Müşteri ve referans verileri, iş ilişkisi boyunca ve zamanaşımı süreleri için en fazla 3 yıl saklanır; yasal yükümlülükler daha uzun süre gerektirebilir.",
            "Faturaya ilişkin bilgiler, Alman ticaret ve vergi mevzuatına uygun olarak 10 yıl boyunca muhafaza edilir.",
            "IP tabanlı hız sınırlama kayıtları 60 saniyelik pencerenin sonunda otomatik olarak silinir.",
            "Sunucu ve güvenlik günlükleri, bir olay incelemesi gerekmediği sürece 90 gün içinde silinir.",
          ],
        },
        {
          heading: "5. Alıcılar ve Veri İşleyenler",
          bullets: [
            "Canlı portfolyonun barındırılması için kullanılan bulut sağlayıcıları (ör. Vercel veya benzeri platformlar).",
            "MONGODB_URI çevre değişkeniyle tanımlanan MongoDB Atlas veya eşdeğer veritabanı hizmetleri.",
            "Gmail SMTP veya geliştirme ortamında nodemailer tarafından sağlanan Ethereal test hesapları üzerinden e-posta gönderimi.",
            "Cloudinary, /api/upload yoluyla yüklenen görsellerin depolanması ve dağıtımı için kullanılır.",
            "Belirtilen ödeme yöntemlerini kullanmanız halinde bankalar veya PayPal gibi ödeme hizmeti sağlayıcıları.",
            "Yasal olarak gerekli olduğunda danışmanlar veya resmi kurumlar.",
          ],
        },
        {
          heading: "6. Uluslararası Veri Aktarımları",
          paragraphs: [
            "Veriler Türkiye'de, AB/AEA bölgesinde ve hizmet sağlayıcılarımızın faaliyet gösterdiği diğer ülkelerde (özellikle Cloudinary ve Gmail için ABD'de) işlenebilir.",
            "AB/AEA dışına aktarımlarda ilgili hizmet sağlayıcının sunduğu Standart Sözleşme Maddeleri veya eşdeğer güvencelere dayanırız.",
          ],
        },
        {
          heading: "7. Güvenlik Önlemleri",
          bullets: [
            "Genel uç noktalar ve yönetim arayüzleri için HTTPS ile şifrelenmiş iletişim.",
            "JWT ve httpOnly çerezlerle korunan yetkili yönetici erişimi.",
            "Kötüye kullanımı sınırlamak için mongoRateLimiter ile hız sınırlama ve IP azaltma.",
            "Bağımlılıkların düzenli olarak güncellenmesi ve sunucu günlüklerinin izlenmesi.",
          ],
        },
        {
          heading: "8. Haklarınız",
          bullets: [
            "Verilerinize erişim talep etme hakkı (GDPR m.15).",
            "Yanlış verilerin düzeltilmesini isteme hakkı (GDPR m.16).",
            "Silme (GDPR m.17) ve işlemenin kısıtlanması (GDPR m.18) hakları.",
            "Sağladığınız verilerin taşınabilirliği (GDPR m.20).",
            "Meşru menfaate dayanan işlemlere itiraz hakkı (GDPR m.21).",
            "Onaya dayanan işlemlerde dilediğiniz zaman onayı geri çekme hakkı.",
            "Bulunduğunuz ülkedeki denetim kurumuna veya Almanya'da LfDI Baden-Württemberg'e şikayette bulunma hakkı.",
          ],
        },
        {
          heading: "9. Haklarınızı Nasıl Kullanabilirsiniz?",
          paragraphs: [
            "Aşağıdaki iletişim bilgilerini kullanarak bize ulaşabilirsiniz. Verilerinizi korumak için kimlik doğrulaması isteyebiliriz. Yasal süreler içinde geri dönüş yapıyoruz.",
          ],
        },
        {
          heading: "10. Müşteri Projeleri ve Partner Logoları",
          paragraphs: [
            "Profesyonel portföy hizmetimin bir parçası olarak, müşterilerim için geliştirdiğim projeleri sergiliyor ve web sitemin partner bölümünde iş ortağı logolarını gösteriyorum.",
            "Bu sergileme, potansiyel müşterilerin çalışmalarımın kalitesini ve kapsamını anlamaları ve köklü iş ortaklarıyla profesyonel ilişkileri göstermek için bir referans görevi görmektedir.",
          ],
          bullets: [
            "Proje Sergileme: Her müşteriden alınan açık yazılı onay ile proje detaylarını (açıklamalar, kullanılan teknolojiler, ekran görüntüleri ve proje sonuçları) gösteriyorum. Müşteri isimleri ve şirket bilgileri yalnızca açıkça izin verildiğinde görüntülenir.",
            "Partner Logoları: Partner şirket logoları, yazılı bir anlaşma veya sözleşme maddesi yoluyla açık izin alındıktan sonra partner bölümünde gösterilir. Logolar yalnızca profesyonel işbirliklerin gösterilmesi amacıyla kullanılır.",
            "Müşteri Kontrolü: Müşteriler, istedikleri zaman doğrudan benimle iletişime geçerek proje bilgilerinin veya logolarının kaldırılmasını veya değiştirilmesini talep etme hakkına sahiptir. Bu tür talepler 7 iş günü içinde işleme alınır.",
            "Gizli Bilgiler: Gizli iş bilgileri, özel kod veya hassas veriler hiçbir zaman açık yazılı yetkilendirme olmadan yayınlanmaz. Tüm sergileme materyalleri yayınlanmadan önce müşteri incelemesi ve onayından geçer.",
            "Hukuki Dayanak: Bu sergileme faaliyetleri, GDPR m.6(1)(a) (rıza) ve GDPR m.6(1)(f) (profesyonel çalışmanın sunulmasında meşru menfaat) kapsamında yürütülür ve müşteri rızası her zaman önceliklidir.",
          ],
        },
        {
          heading: "11. Güncellemeler",
          paragraphs: [
            "Hizmetlerimiz veya yasal yükümlülüklerimiz değiştiğinde bu politikayı güncelleyeceğiz. Güncel sürüme /privacy adresinden erişebilirsiniz.",
          ],
        },
      ],
      contactHeading: "Gizlilik talepleri için iletişim",
      contactDetails: [
        "Ramazan Yıldırım",
        "Adres: Hebelstraße 1, 77880 Sasbach, Almanya",
        "E-posta: aliramazanyildirim@gmail.com",
        "Telefon: +49 151 67145187",
      ],
      note: "Çeviriler arasında farklılık olması halinde İngilizce metin esas alınır. Yerel tüketici haklarınız saklıdır.",
    },
    terms: {
      title: "Hizmet Şartları ve Koşulları",
      lastUpdated: "Güncelleme tarihi: 19 Ekim 2025",
      intro: [
        "Bu Hizmet Şartları ve Koşulları ('Şartlar'), Ramazan Yıldırım ('Hizmet Sağlayıcı', 'ben') tarafından müşterilere ('Müşteri', 'siz') bu portföy platformu aracılığıyla sunulan tüm profesyonel yazılım geliştirme hizmetlerini düzenler.",
        "Hizmetlerime başvurarak, teklif talep ederek veya bir proje anlaşması yaparak, bu Şartları tamamen kabul etmiş olursunuz. Bu Şartlar, bireysel proje anlaşmaları veya sözleşmelerin yanı sıra geçerlidir.",
      ],
      sections: [
        {
          heading: "1. Hizmet Kapsamı",
          paragraphs: [
            "Aşağıdakiler dahil ancak bunlarla sınırlı olmamak üzere profesyonel yazılım geliştirme hizmetleri sunuyorum:",
          ],
          bullets: [
            "Full-stack web geliştirme (React, Next.js, Node.js, Express, MongoDB)",
            "Modern framework'ler ve responsive tasarımla frontend geliştirme",
            "Backend geliştirme ve API entegrasyonları",
            "Kurumsal sistem danışmanlığı ve SAP/ABAP geliştirme",
            "E-ticaret çözümleri ve ödeme entegrasyonları (Stripe, PayPal)",
            "Proje danışmanlığı, mimari tasarım ve kod optimizasyonu",
            "Müşteri gereksinimlerine özel yazılım çözümleri",
          ],
        },
        {
          heading: "2. Proje Süreci",
          bullets: [
            "İlk Danışma: Müşteriler iletişim formum üzerinden taleplerini gönderir. 2 iş günü içinde ön geri bildirimle yanıt veririm.",
            "Proje Teklifi: Danışmadan sonra kapsam, zaman çizelgesi (1 hafta - 6 ay), teslimatlar ve fiyatlandırma içeren detaylı teklif sunarım.",
            "Anlaşma: Projeler, teklifin yazılı kabulü ve üzerinde anlaşılan avans ödemesinin (genellikle %30-50) alınmasıyla başlar.",
            "Geliştirme: Düzenli ilerleme güncellemeleri ve müşteri geri bildirim oturumlarıyla üzerinde anlaşılan kilometre taşlarına göre çalışırım.",
            "Teslimat ve Test: Final teslimatları müşteri incelemesinden geçer. Proje karmaşıklığına göre 7-14 günlük test süresi sağlarım.",
            "Son Ödeme ve Yayın: Müşteri onayından sonra, proje yayını veya tesliminden önce son ödeme yapılır.",
          ],
        },
        {
          heading: "3. Fiyatlandırma ve Ödeme Koşulları",
          bullets: [
            "Proje Fiyatları: Tüm fiyatlar Euro (EUR) cinsinden belirtilir ve uygun olduğunda Alman KDV'si (%19) dahildir.",
            "Referans İndirimleri: Müşteriler referans seviyesine göre %3, %6 veya %9 indirim sunan referans programımdan faydalanabilir.",
            "Ödeme Planı: Standart ödeme koşulları %50 avans, %50 tamamlanma üzerinedir. 3 ayı aşan projeler için kilometre taşı bazlı ödemeler uygulanır.",
            "Ödeme Yöntemleri: Banka havalesi (SEPA), PayPal ve faturalarda belirtilen diğer yöntemleri kabul ediyorum.",
            "Geç Ödeme: Faturalar 14 gün içinde ödenmelidir. Geç ödemelerde baz oranın %5 üzeri faiz uygulanır (§ 288 BGB).",
            "Ek Maliyetler: Üçüncü taraf hizmetler için maliyetler (hosting, API'ler, premium araçlar), proje teklifinde belirtilmedikçe ayrı faturalandırılır.",
          ],
        },
        {
          heading: "4. Müşteri Yükümlülükleri",
          bullets: [
            "Zamanında Bilgilendirme: Müşteriler gerekli tüm bilgileri, erişim kimlik bilgilerini ve materyalleri üzerinde anlaşılan sürelerde sağlamalıdır.",
            "Geri Bildirim ve Onaylar: Müşteriler teslimatları incelemeli ve üzerinde anlaşılan sürelerde (genellikle 5-7 iş günü) geri bildirim sağlamalıdır.",
            "İçerik Sorumluluğu: Müşteriler sağladıkları tüm içerik, metin, görsel ve materyallerin yasallığından sorumludur.",
            "İşbirliği: Müşteriler karar verme yetkisine sahip bir irtibat kişisi atamalı ve zamanında yanıt vermelidir.",
            "Üçüncü Taraf Hizmetler: Müşteriler kullandıkları üçüncü taraf hizmetler için lisans, abonelik ve hesapları sürdürmekten sorumludur.",
          ],
        },
        {
          heading: "5. Proje Zaman Çizelgeleri ve Gecikmeler",
          bullets: [
            "Tahmini Zaman Çizelgeleri: Tüm proje süresi tahminleri (1 hafta - 6 ay), üzerinde anlaşılan kapsama dayanan en iyi çaba projeksiyonlarıdır.",
            "Müşteri Kaynaklı Gecikmeler: Geç müşteri geri bildirimi, eksik materyaller veya kapsam değişiklikleri nedeniyle gecikmeler, yükümlülüklerimi etkilemeden zaman çizelgelerini orantılı olarak uzatır.",
            "Mücbir Sebepler: Makul kontrolüm dışındaki olaylar (teknik arızalar, üçüncü taraf hizmet kesintileri, doğal afetler) nedeniyle gecikmelerden sorumlu değilim.",
            "Zaman Çizelgesi Uzatmaları: Önemli kapsam değişiklikleri zaman çizelgesi yeniden müzakeresi ve ek ücretler gerektirebilir.",
          ],
        },
        {
          heading: "6. Değişiklikler ve Ek Çalışmalar",
          bullets: [
            "Kapsam Değişiklikleri: Üzerinde anlaşılan proje kapsamındaki değişiklikler yazılı onay gerektirir ve ek maliyetler ve zaman çizelgesi uzatmalarına neden olabilir.",
            "Değişiklik Talepleri: Geliştirme sırasında küçük değişiklikler makul olduğunda karşılanır. Büyük değişiklikler ayrı teklif edilir.",
            "Ek Özellikler: Orijinal kapsamda bulunmayan özellikler, standart saat ücretimiz veya proje bazlı fiyatlandırmayla ek çalışma olarak faturalandırılır.",
            "Müşteri Onayı: Tüm önemli değişiklikler uygulanmadan önce müşteri tarafından yazılı olarak onaylanmalıdır.",
          ],
        },
        {
          heading: "7. Fikri Mülkiyet Hakları",
          bullets: [
            "Özel Kod: Tam ödeme yapıldıktan sonra müşteriler, projeleri için özel olarak geliştirilen özel kodun mülkiyetini alır.",
            "Kullanım Lisansı: Müşteriler teslim edilen tüm çalışmaları iş amaçları için kullanmak üzere kalıcı, dünya çapında lisans alır.",
            "Saklı Haklar: Şunlara ilişkin hakları saklı tutarım: (a) yeniden kullanılabilir kod kütüphaneleri ve framework'ler, (b) genel metodolojiler ve teknikler, (c) önceden var olan kendi fikri mülkiyetim.",
            "Üçüncü Taraf Bileşenleri: Açık kaynak bileşenleri ve üçüncü taraf kütüphaneleri kendi lisanslarına tabi olmaya devam eder.",
            "Portföy Kullanımı: Gizlilik Politikamda belirtildiği gibi, müşteri onayıyla proje çalışmalarını sergileyebilirim. Müşteriler istediği zaman kaldırma talebinde bulunabilir.",
            "Gizlilik: Müşteri iş bilgilerinin gizliliğini korur ve özel kod veya hassas verileri yetkilendirme olmadan ifşa etmem.",
          ],
        },
        {
          heading: "8. Kalite Güvencesi ve Test",
          bullets: [
            "Kalite Standartları: Tüm teslimatlar profesyonel endüstri standartlarını ve üzerinde anlaşılan spesifikasyonları karşılar.",
            "Tarayıcı Uyumluluğu: Web projeleri büyük tarayıcılarda (Chrome, Firefox, Safari, Edge) mevcut ve önceki ana sürümlerinde test edilir.",
            "Responsive Tasarım: Projeler açıkça hariç tutulmadıkça masaüstü, tablet ve mobil cihazlar için responsive tasarım içerir.",
            "Test Dönemi: Müşterilerin teslimat sonrası sorunları bildirmek için 7-14 günleri vardır. Bu dönemde keşfedilen hataları ve hataları ek ücret ödemeden düzeltirim.",
            "Hata Düzeltmeleri: Temel işlevselliği etkileyen kritik hatalar önceliklendirilir. Küçük UI sorunları müsaitlik durumuma göre ele alınır.",
          ],
        },
        {
          heading: "9. Garantiler ve Sınırlamalar",
          bullets: [
            "İşlevsel Garanti: Teslim edilen çalışmanın teslimat sonrası 30 gün boyunca proje belgelerinde açıklandığı şekilde önemli ölçüde işlev göreceğini garanti ediyorum.",
            "İş Sonucu Garantisi Yok: Belirli iş sonuçları, gelir, trafik, dönüşümler veya SEO sıralamalarını garanti etmiyorum.",
            "Üçüncü Taraf Hizmetler: Üçüncü taraf hizmetlerin (API'ler, hosting, ödeme işlemcileri) arızaları, değişiklikleri veya durdurulmasından sorumlu değilim.",
            "Tarayıcı/Platform Değişiklikleri: Tarayıcı güncellemeleri, platform değişiklikleri veya teknolojilerin eskimesi nedeniyle işlevsellik değişikliklerinden sorumlu değilim.",
            "Müşteri Değişiklikleri: Müşteriler danışmam olmadan teslim edilen kodu değiştirirse garanti geçersiz olur.",
          ],
        },
        {
          heading: "10. Destek ve Bakım",
          bullets: [
            "İlk Destek: Teslimat sonrası sorular ve küçük ayarlamalar için 30 günlük e-posta desteği dahildir.",
            "Genişletilmiş Destek: Sürekli bakım, hosting yönetimi ve özellik güncellemeleri ayrı bakım anlaşmaları yoluyla mevcuttur.",
            "Yanıt Süreleri: Destek talepleri 1-2 iş günü içinde onaylanır. Çözüm süresi sorun karmaşıklığına bağlıdır.",
            "Ayrı Ücretler: İlk 30 günlük dönemin ötesindeki destek saatlik veya aylık bakım paketleri yoluyla faturalandırılır.",
          ],
        },
        {
          heading: "11. Sorumluluk ve Tazminat",
          bullets: [
            "Sorumluluk Sınırı: Bir projeden kaynaklanan herhangi bir talep için toplam sorumluluğum, o proje için ödenen toplam ücretlerle sınırlıdır.",
            "İstisnalar: Kayıp karlar, veri kaybı veya iş kesintisi dahil olmak üzere dolaylı, sonuç veya özel zararlardan sorumlu değilim.",
            "Müşteri Tazminatı: Müşteriler beni şunlardan kaynaklanan taleplere karşı tazmin eder: (a) sağladıkları içerik, (b) teslim edilen çalışmayı kullanımları, (c) üçüncü taraf haklarının ihlali, (d) geçerli yasalara uyulmaması.",
            "Alman Hukuku: Maksimum sorumluluk Alman yasal sınırlarını takip eder (bağış unsurları için § 521 BGB, hizmet sözleşmeleri için § 619a BGB).",
          ],
        },
        {
          heading: "12. Gizlilik ve Veri Koruma",
          bullets: [
            "Gizli Bilgiler: Her iki taraf da proje sırasında paylaşılan gizli bilgileri kesinlikle gizli tutmayı kabul eder.",
            "Veri Koruma: Kişisel veri işleme Gizlilik Politikama ve GDPR gerekliliklerine uyar.",
            "Güvenlik Önlemleri: Müşteri verilerini ve proje materyallerini korumak için endüstri standardı güvenlik önlemleri uygularım.",
            "Veri Saklama: Proje dosyaları ve iletişim, yasal ve garanti amaçları için proje tamamlandıktan sonra 3 yıl saklanır.",
          ],
        },
        {
          heading: "13. Fesih ve İptal",
          bullets: [
            "Müşteri Feshi: Müşteriler 14 gün yazılı bildirimle projeleri feshedebilir. Fesih tarihine kadar tamamlanan çalışma tam olarak ödenmelidir.",
            "Hizmet Sağlayıcı Feshi: Şu durumlarda projeleri feshedebilirim: (a) müşteri ödeme koşullarını ihlal ederse, (b) müşteri yükümlülüklerini yerine getirmezse, (c) proje uygulanamaz hale gelirse.",
            "Karşılıklı Fesih: Projeler, tamamlanan çalışmanın adil şekilde karara bağlanmasıyla karşılıklı yazılı anlaşmayla feshedilebilir.",
            "Feshin Etkisi: Fesih üzerine müşteriler tüm tamamlanmış çalışma teslimatlarını alır ve tarihe kadar tamamlanan çalışma için ödeme yapar.",
            "İadeler: Avans ödemeleri, üzerinde anlaşılan hizmetleri sunmadığım veya sebepsiz feshettiğim durumlar dışında iade edilmez.",
          ],
        },
        {
          heading: "14. Uyuşmazlık Çözümü",
          bullets: [
            "İyi Niyetli Müzakere: Taraflar öncelikle iyi niyetli müzakere yoluyla çözüm denemeyi kabul eder.",
            "Arabuluculuk: Müzakere başarısız olursa, taraflar yasal işlem başlatmadan önce arabuluculuk denemeyi kabul eder.",
            "Yürürlükteki Hukuk: Bu Şartlar, Birleşmiş Milletler satış hukuku (CISG) hariç olmak üzere Alman hukukuna tabidir.",
            "Yargı Yetkisi: Münhasır yargı yetkisi Offenburg, Almanya (77880 Sasbach'a en yakın) mahkemelerine aittir.",
            "Dil: Uyuşmazlık durumunda bu Şartların Almanca versiyonu önceliklidir.",
          ],
        },
        {
          heading: "15. Genel Hükümler",
          bullets: [
            "Tam Anlaşma: Bu Şartlar, bireysel proje anlaşmalarıyla birlikte taraflar arasındaki tam anlaşmayı oluşturur.",
            "Değişiklikler: Bu Şartlarda yapılacak değişiklikler yazılı anlaşma gerektirir. Projeye özel değişiklikler bu genel Şartları etkilemez.",
            "Bölünebilirlik: Herhangi bir hüküm uygulanamaz bulunursa, kalan hükümler tam olarak yürürlükte kalır.",
            "Devir: Müşteriler yazılı onayımız olmadan proje anlaşmalarını devredemez. Makul bildirimle devredebiliriz.",
            "Mücbir Sebepler: Hiçbir taraf makul kontrol dışındaki koşullar nedeniyle yerine getirmeme için sorumlu değildir.",
            "Sürdürülme: Fikri mülkiyet, gizlilik, ödeme ve sorumluluğa ilişkin hükümler proje tamamlanması veya feshinden sonra da devam eder.",
          ],
        },
        {
          heading: "16. Referans Programı Koşulları",
          bullets: [
            "Uygunluk: Yeni müşteri refere eden müşteriler kendi projelerinde indirim alır: %3 (1. referans), %6 (2.), %9 (3.+).",
            "Geçerli Referanslar: Referanslar tamamlanmış ücretli projelerle sonuçlanmalıdır. İndirimler refere eden müşterinin bir sonraki projesine uygulanır.",
            "Nakit Değeri Yok: Referans indirimlerinin nakit değeri yoktur ve aktarılamaz veya diğer promosyonlarla birleştirilemez.",
            "Program Değişiklikleri: Aktif katılımcılara 30 gün önceden haber vererek referans programını değiştirme veya sonlandırma hakkını saklı tutarım.",
          ],
        },
      ],
      contactHeading: "Bu Şartlar hakkında sorularınız mı var?",
      contactDetails: [
        "Ramazan Yıldırım",
        "Yazılım Geliştirme Hizmetleri",
        "Adres: Hebelstraße 1, 77880 Sasbach, Almanya",
        "E-posta: aliramazanyildirim@gmail.com",
        "Telefon: +49 151 67145187",
      ],
      note: "Bu Şartlar İngilizce, Almanca ve Türkçe olarak sağlanmaktadır. Tutarsızlık durumunda, zorunlu tüketici koruma yasalarına tabi olarak Almanya/AB'deki müşteriler için Almanca versiyon önceliklidir.",
    },
    solutions: {
      leadGeneration: {
        slug: "lead-generation-websites",
        title: "İletişim getiren siteler",
        subtitle: "Ziyaretçileri fırsatlara dönüştürün",
        hero: {
          headline: "Siteniz satış motoru olarak çalışsın",
          description: "Her sayfa, her kelime, her etkileşim dikkat çekmek ve ziyaretçileri işletmenizle iletişim kurmaya hazır karar vericilere dönüştürmek için tasarlandı.",
          cta: "Hemen iletişim almaya başlayın",
        },
        features: [
          {
            title: "Dönüşüm Optimizasyonu",
            description: "Her kelime dirençleri azaltmak ve ziyaretçileri harekete geçirmeye rehberlik etmek için seçildi.",
            icon: "✨",
          },
          {
            title: "Akıllı İletişim Formları",
            description: "Doğru zamanda doğru bilgileri toplayan akıllı formlar.",
            icon: "📋",
          },
          {
            title: "Güven Sinyalleri",
            description: "Müşteri görüşleri ve sertifikalar alıcı kaygılarını aşmak için konumlandırıldı.",
            icon: "⭐",
          },
        ],
        testimonial: {
          quote: "İlk üç ayda nitelikli iletişim sayısında %45 artış gördük.",
          author: "Sarah K.",
          role: "B2B SaaS Kurucusu",
          metric: "+%45 İletişim",
        },
        pricing: [
          {
            name: "Başlangıç",
            price: "€2.500",
            features: ["Beş sayfaya kadar", "İletişim formu", "Mobil uyumlu", "Temel analitik"],
          },
          {
            name: "Profesyonel",
            price: "€5.500",
            features: ["15 sayfaya kadar", "Gelişmiş formlar", "CRM entegrasyonu", "A/B Testleri"],
            highlight: true,
          },
          {
            name: "Kurumsal",
            price: "Özel fiyat",
            features: ["Sınırsız sayfalar", "Tam otomasyon", "Özel entegrasyonlar", "Bağlı hesap yöneticisi"],
          },
        ],
      },
      performanceSeo: {
        slug: "performance-seo",
        title: "Daha hızlı site & bulunabilirlik",
        subtitle: "Hız ve görünürlük sonuç verir",
        hero: {
          headline: "Kazanmak için yeterince hızlı, bulunmak için yeterince görünür",
          description: "1 saniyede yüklenenen site, 3 saniyede yüklenenden 7 kat daha iyi dönüştürür. Hız ve SEO için inşa ediyoruz.",
          cta: "Site hızınızı artırın",
        },
        features: [
          { title: "Core Web Vitals Optimized", description: "LCP, FID, CLS—her Google metriği için optimize edildi.", icon: "⚡" },
          { title: "SEO Mimarisi", description: "Yapılandırılmış veriler ve iç bağlantı için anında görünürlük.", icon: "🔍" },
          { title: "Performans İzleme", description: "Hız ve organik görünürlüğü takip eden gerçek zamanlı panolar.", icon: "📊" },
        ],
        testimonial: { quote: "Site hızı 4,2s'den 1,1s'ye iyileşti. 4 ayda organik trafik +62%.", author: "Michael T.", role: "E-Commerce Manager", metric: "+62% organik" },
        pricing: [
          { name: "Hız Denetimi", price: "€500", features: ["Tam analiz", "Engel tanımlama", "Optimizasyon planı"] },
          { name: "Performans Sprint", price: "€3.500", features: ["Tam optimizasyon", "Image CDN", "Kod Bölme"], highlight: true },
          { name: "SEO & Performans", price: "€6.000", features: ["Tam SEO", "Teknik denetim", "Schema Markup"] },
        ],
      },
      ecommerceSolutions: {
        slug: "ecommerce-solutions",
        title: "Online mağaza kurulumu",
        subtitle: "Sıfırdan karlı satışlara",
        hero: {
          headline: "Mağazanız otomatikleştirilmiş ve optimize edilmiş",
          description: "Ürünler ve fiyatlardan daha fazlası. Güven, kolaylık ve gitme nedeni olmayan alışveriş deneyimi.",
          cta: "Mağazanızı başlatın",
        },
        features: [
          { title: "Ürün Yönetimi", description: "Sezgisel admin. Ürünleri yükleyin, envanteri yönetin, fiyatları ayarlayın.", icon: "🛍️" },
          { title: "Ödeme Entegrasyonu", description: "Stripe, PayPal ve daha fazlası. PCI-uyumlu. Checkout optimize edildi.", icon: "💳" },
          { title: "Teslimat Hazır", description: "Sipariş takibi, gemi integrasyonları, müşteri bildirimleri.", icon: "📦" },
        ],
        testimonial: { quote: "Ücretleri %40 azaltırken mağaza üzerinde tam kontrol sahibi olduk.", author: "Elena M.", role: "Moda Markası Sahibi", metric: "%40 ücret azaltması" },
        pricing: [
          { name: "Temel Mağaza", price: "€4.000", features: ["50'ye kadar ürün", "Temel envanter", "Ödeme işleme"] },
          { name: "Büyüme Mağazası", price: "€8.000", features: ["Sınırsız ürünler", "Geliştirilmiş envanter", "Email otomasyon"], highlight: true },
          { name: "Kurumsal", price: "Özel", features: ["Multi-kanal", "Toptan satış", "Abonelikler"] },
        ],
      },
      cmsManagement: {
        slug: "cms-management",
        title: "Kolay içerik güncellemesi",
        subtitle: "Geliştirici olmadan sitenizi güncelleyin",
        hero: {
          headline: "İçeriğiniz, kurallarınız. Kod gerekli değil.",
          description: "Kendini doğal gösteren bir CMS. Yazılar yayınlayın, sayfaları güncelleyin—tümü kullanmak isteyeceğiniz bir arayüzden.",
          cta: "Ekibinizi güçlendirin",
        },
        features: [
          { title: "Görsel Editör", description: "Teknik olmayan ekip üyeleri için WYSIWYG arayüzü.", icon: "✏️" },
          { title: "İçerik Planlaması", description: "İçeriği haftalar önceden planlayın. Optimal zamanda otomatik yayınlama.", icon: "📅" },
          { title: "Ekip İşbirliği", description: "Çok kullanıcı rolleri, izinler ve onay iş akışları yerleşik.", icon: "👥" },
        ],
        testimonial: { quote: "Pazarlama ekibi şimdi değişiklikleri anında yayınlıyor. Üretkenlik atıyor.", author: "David P.", role: "Pazarlama Müdürü", metric: "5x hızlı" },
        pricing: [
          { name: "Basit CMS", price: "€1.500", features: ["5 içerik tipi", "Temel editör", "1-3 kullanıcı"] },
          { name: "Ekip CMS", price: "€3.500", features: ["Sınırsız tipler", "Görsel editör", "10+ kullanıcı"], highlight: true },
          { name: "İleri", price: "€6.500", features: ["Özel alanlar", "Webhooks", "Sürüm kontrolü"] },
        ],
      },
      analyticsTracking: {
        slug: "analytics-tracking",
        title: "Önemli metrikleri takip et",
        subtitle: "Siteniz hakkında veriye dayalı içgörüler",
        hero: {
          headline: "Neyin çalıştığını görün. Çalışmayan'ı düzeltin.",
          description: "Ham veriler insight değildir. Ziyaretçileri, dönüşümleri ve fırsatları hakkında gerçek soruları yanıtlayan analizler kuruyoruz.",
          cta: "Açıklık elde edin",
        },
        features: [
          { title: "Hedef Takibi", description: "Formlar, satın almalar, kayıtlar. Hangi kanallar gerçek değer sağladığını bilin.", icon: "🎯" },
          { title: "Davranış İçgörüleri", description: "Isı haritaları, oturum kayıtları. Ziyaretçilerin nasıl etkileşime geçtiğini görün.", icon: "👀" },
          { title: "Özel Panolar", description: "Aylık raporlar önemli olanı vurgulayan. Anlaşılabilir ve işlenebilir.", icon: "📈" },
        ],
        testimonial: { quote: "Sonunda hangi sayfaların dönüştürme sağladığını anladım. Dönüşüm oranımızı ikiye katladık.", author: "Jessica L.", role: "Startup Kurucusu", metric: "2x dönüşüm" },
        pricing: [
          { name: "Temel", price: "€300/ay", features: ["Temel takip", "Aylık raporlar", "Hedef kurulumu"] },
          { name: "Pro", price: "€800/ay", features: ["Gelişmiş takip", "Isı haritaları", "Oturum kayıtları"], highlight: true },
          { name: "Analytics+", price: "€1.500/ay", features: ["Pro'daki her şey", "A/B testleri", "24/7 destek"] },
        ],
      },
      teamTraining: {
        slug: "team-training",
        title: "Teslim & ekip eğitimi",
        subtitle: "Ekibinizi sitenin sahibi olmaya güçlendirin",
        hero: {
          headline: "Kalıcı bilgi aktarımı",
          description: "Çalışan bir teslimat. Video walkthroughs, yazılı rehberler, live Q&A oturumları ve devam eden destek.",
          cta: "Ekibinize yatırım yapın",
        },
        features: [
          { title: "Kapsamlı Belgeler", description: "Her rol için adım adım kılavuzlar ve video eğitimleri.", icon: "📚" },
          { title: "Canlı Eğitim Oturumları", description: "Şirket içi veya uzaktan yapılan workshoplar günlük güncellemeden gelişmiş konfigürasyona kadar.", icon: "🎓" },
          { title: "Devam Eden Destek", description: "Sorular için ayrılmış destek kanalı. İhtiyacınız olduğunda buradayız.", icon: "🤝" },
        ],
        testimonial: { quote: "Eğitim inanılmaz kapsamlıydı. Tüm ekibimiz hemen kendine güveniyordu.", author: "Thomas R.", role: "Operasyon Müdürü", metric: "%100 güven" },
        pricing: [
          { name: "Standart", price: "€2.000", features: ["Yazılı rehberler", "Video eğitimler", "1 canlı oturum"] },
          { name: "Premium", price: "€4.500", features: ["Standart'taki her şey", "2 günlük eğitim", "30 gün destek"], highlight: true },
          { name: "İleri Destek", price: "€1.200/ay", features: ["Aylık eğitim", "Ayrılmış kanal", "Stratejik rehberlik"] },
        ],
      },
    },
  },
} as const;

export type TranslationDictionary = (typeof translations)[keyof typeof translations];
