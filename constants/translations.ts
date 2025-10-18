export const translations = {
  en: {
    nav: {
      languageMenu: {
        label: "Language",
        languages: {
          en: "English",
          de: "German",
          tr: "Turkish",
        },
      },
      aria: {
        toggle: "Toggle menu",
        close: "Close menu",
        language: "Select language",
      },
      items: [
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
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Go to",
      scrollTopAria: "Scroll to top",
      privacyLink: "Privacy Policy",
      privacyAria: "Open the privacy policy page",
    },
    hero: {
      headlineTop: "HI THERE -",
      headlineBottom: "I'M ALI RAMAZAN",
      location: "Offenburg",
      scrollLabel: "(Scroll For More)",
      about: {
        introParagraphs: [
          "Fast, scalable, and reliable web solutions built with a clear focus on business goals and user needs. With strong fullstack experience and a background in both modern and enterprise technologies, every solution is designed to work efficiently—and the right way.",
          "From new product development to system optimization, complex challenges are addressed through clean architecture and user-centered design, creating sustainable digital products with long-term value.",
          "Every project starts with understanding the problem, delivering the right solution, and creating lasting impact through thoughtful engineering.",
        ],
        sections: [
          {
            title: "Core Competencies",
            items: [
              "Frontend: React, Next.js, Tailwind CSS",
              "Backend: Node.js, Express, MongoDB",
              "Integrations: Stripe, Uploadthing",
              "Enterprise Systems: SAP, ABAP",
              "Architecture: Scalable, maintainable, high-performance systems",
            ],
          },
          {
            title: "Collaboration Approach",
            items: [
              "Focus on quality, clarity, and scalability",
              "Transparent communication and aligned workflows",
              "Technically sound solutions with real business value",
              "Long-term thinking behind every decision",
            ],
          },
          {
            title: "Who I Work With",
            items: [
              "Startups: MVP to stable product",
              "Enterprises: SAP modernization and integrations",
              "Agencies: Flexible frontend/backend development",
              "Entrepreneurs: From idea to launch-ready product",
            ],
          },
        ],
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
          heading: "10. Updates",
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
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Besuche",
      scrollTopAria: "Nach oben scrollen",
      privacyLink: "Datenschutzerklärung",
      privacyAria: "Zur Datenschutzerklärung wechseln",
    },
    hero: {
      headlineTop: "HI DU -",
      headlineBottom: "ICH BIN ALI RAMAZAN",
      location: "Offenburg",
      scrollLabel: "(Scroll für mehr)",
      about: {
        introParagraphs: [
          "Schnelle, skalierbare und zuverlässige Weblösungen mit klarem Fokus auf Geschäftsziele und Nutzerbedürfnisse. Dank umfassender Fullstack-Erfahrung und Know-how in modernen wie auch Enterprise-Technologien entstehen Lösungen, die effizient funktionieren – und zwar richtig.",
          "Von neuer Produktentwicklung bis Systemoptimierung werden komplexe Herausforderungen mit sauberer Architektur und nutzerzentriertem Design gelöst – für nachhaltige digitale Produkte mit langfristigem Wert.",
          "Jedes Projekt beginnt mit dem Verständnis des Problems, liefert die passende Lösung und schafft durch durchdachte Technik nachhaltigen Impact.",
        ],
        sections: [
          {
            title: "Kernkompetenzen",
            items: [
              "Frontend: React, Next.js, Tailwind CSS",
              "Backend: Node.js, Express, MongoDB",
              "Integrationen: Stripe, Uploadthing",
              "Enterprise-Systeme: SAP, ABAP",
              "Architektur: Skalierbare, wartbare, performante Systeme",
            ],
          },
          {
            title: "Zusammenarbeit",
            items: [
              "Fokus auf Qualität, Klarheit und Skalierbarkeit",
              "Transparente Kommunikation und abgestimmte Workflows",
              "Technisch fundierte Lösungen mit echtem Geschäftswert",
              "Langfristiges Denken bei jeder Entscheidung",
            ],
          },
          {
            title: "Mit wem ich arbeite",
            items: [
              "Startups: Vom MVP zum stabilen Produkt",
              "Unternehmen: SAP-Modernisierung und Integrationen",
              "Agenturen: Flexibles Frontend-/Backend-Development",
              "Unternehmer:innen: Von der Idee bis zum marktreifen Produkt",
            ],
          },
        ],
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
          heading: "10. Aktualisierungen",
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
    },
    footer: {
      copyright: "© 2025. Ali Ramazan Yildirim",
      socialAriaPrefix: "Git",
      scrollTopAria: "Yukarı kaydır",
      privacyLink: "Gizlilik Politikası",
      privacyAria: "Gizlilik politikası sayfasını aç",
    },
    hero: {
      headlineTop: "MERHABA -",
      headlineBottom: "BEN ALİ RAMAZAN",
      location: "Offenburg",
      scrollLabel: "(Daha fazlası için kaydır)",
      about: {
        introParagraphs: [
          "İş hedeflerine ve kullanıcı ihtiyaçlarına odaklanan, hızlı, ölçeklenebilir ve güvenilir web çözümleri. Modern ve kurumsal teknolojilerdeki güçlü fullstack deneyimim sayesinde her çözümü verimli ve doğru şekilde tasarlıyorum.",
          "Yeni ürün geliştirmeden sistem optimizasyonuna kadar karmaşık zorlukları temiz mimari ve kullanıcı odaklı tasarımla ele alıyor, uzun vadeli değer sağlayan dijital ürünler oluşturuyorum.",
          "Her proje, problemi anlamak, doğru çözümü sunmak ve derin mühendislikle kalıcı bir etki yaratmakla başlar.",
        ],
        sections: [
          {
            title: "Temel Yetkinlikler",
            items: [
              "Frontend: React, Next.js, Tailwind CSS",
              "Backend: Node.js, Express, MongoDB",
              "Entegrasyonlar: Stripe, Uploadthing",
              "Kurumsal Sistemler: SAP, ABAP",
              "Mimari: Ölçeklenebilir, sürdürülebilir ve yüksek performanslı sistemler",
            ],
          },
          {
            title: "İş Birliği Yaklaşımı",
            items: [
              "Kalite, netlik ve ölçeklenebilirliğe odaklanma",
              "Şeffaf iletişim ve uyumlu iş akışları",
              "Gerçek iş değeri sağlayan teknik çözümler",
              "Her kararda uzun vadeli düşünce",
            ],
          },
          {
            title: "Kimlerle Çalışıyorum",
            items: [
              "Startuplar: MVP'den sağlam ürüne",
              "Kurumsallar: SAP modernizasyonu ve entegrasyonlar",
              "Ajanslar: Esnek frontend/backend geliştirme",
              "Girişimciler: Fikirden lansman hazır ürüne",
            ],
          },
        ],
      },
    },
    littleAbout: {
      heading: "Benim Hakkımda Biraz -",
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
      headingLineTwo: "ben de hayranlık uyandıran bir şey yapayım.",
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
          heading: "10. Güncellemeler",
          paragraphs: [
            "Hizmetlerimiz veya yasal yükümlülüklerimiz değiştiğinde bu politikayı güncelleyeceğiz. Güncel sürüme /privacy adresinden erişebilirsiniz.",
          ],
        },
      ],
      contactHeading: "Gizlilik talepleri için iletişim",
      contactDetails: [
        "Ali Ramazan Yıldırım",
        "Adres: Hebelstraße 1, 77880 Sasbach, Almanya",
        "E-posta: aliramazanyildirim@gmail.com",
        "Telefon: +49 151 67145187",
      ],
      note: "Çeviriler arasında farklılık olması halinde İngilizce metin esas alınır. Yerel tüketici haklarınız saklıdır.",
    },
  },
} as const;

export type TranslationDictionary = (typeof translations)[keyof typeof translations];
