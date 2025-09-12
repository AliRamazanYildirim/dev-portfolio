export const INVOICE_CONSTANTS = {
    VAT_RATE: 0.19, // 19.00% MwSt (German standard VAT rate)
    PAYMENT_TERMS_DAYS: 30,
    API: {
        GENERATE_ENDPOINT: "/api/invoice/generate",
    },
    COMPANY: {
        NAME: "Ali Ramazan Yildirim",
        ADDRESS: "Mustafa Kemal Paşa Cad. No: 123",
        CITY: "İstanbul, 34000",
        COUNTRY: "Turkey",
        EMAIL: "hello@aliramazan.dev",
        PHONE: "+90 532 XXX XX XX",
        IBAN: "DE89 3704 0044 0532 0130 00",
    },
    PROJECT: {
        DEFAULT_TITLE: "Web Development Project",
        DEFAULT_DESCRIPTION:
            "Custom web development solution including design, development, and deployment.",
        DEFAULT_TECHNOLOGIES: [
            "React, Next.js, TypeScript, Tailwind CSS",
            "Vue.js, Nuxt.js, JavaScript, SCSS",
            "Node.js, Express, MongoDB, PostgreSQL"
        ],
        DEFAULT_CATEGORY: [
            "Web Development",
            "Mobile App Development",
            "UI/UX Design",
            "Consulting"
        ],
        DEFAULT_DELIVERABLES: [
            "Responsive website design",
            "Frontend development",
            "Backend API development",
            "Database setup",
            "SEO optimization",
            "Performance optimization",
            "Mobile app deployment",
            "UI/UX prototyping"
        ],
    },
    PAYMENT: {
        DEFAULT_REFERENCE: [
            "Please include invoice number in payment reference",
            "Include your company name in the payment reference"
        ],
        METHODS: [
            "Bank Transfer",
            "PayPal",
            "Credit Card"
        ]
    },
} as const;
