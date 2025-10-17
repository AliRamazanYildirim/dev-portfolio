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
        '"Teknolojiye olan tutkumla büyürken, yazılım geliştirmeyi her zaman hızla gelişen, dinamik ve olanaklarla dolu dijital dünyanın bir yansıması olarak gördüm. İnovasyonun ilerlemeyi tetiklediği gibi, kodlama da uyum sağlama, problem çözme ve kalıcı çözümler üretmeyle ilgilidir. Her zorluk bir büyüme fırsatı, her aksilik bir ders ve her başarı yeni bir dönüm noktasıdır. Dijital dünyayı bir satır kodla  öğrenmeye, yaratmaya ve şekillendirmeye devam etmekten heyecan duyuyorum."',
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
  },
} as const;

export type TranslationDictionary = (typeof translations)[keyof typeof translations];
