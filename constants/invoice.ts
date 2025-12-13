export const INVOICE_CONSTANTS = {
    VAT_RATE: 0.19, // 19.00% MwSt (German standard VAT rate)
    PAYMENT_TERMS_DAYS: 30,
    API: {
        GENERATE_ENDPOINT: "/api/invoice/generate",
    },
    COMPANY: {
        NAME: "Ali Ramazan Yildirim",
        ADDRESS: "Hebelstrasße 1",
        CITY: "Sasbach, 77880",
        COUNTRY: "Deutschland",
        EMAIL: "aliramazanyildirim@gmail.com",
        PHONE: "+49 151 67145187",
        IBAN: "DE86 5009 0500 0006 4023 17",
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
            "E-Commerce",
            "Consulting"
        ],
        DEFAULT_DURATION: [
            "1 Week",
            "2 Weeks",
            "3 Weeks",
            "4 Weeks",
            "1 Month",
            "2 Months",
            "3 Months",
            "4 Months",
            "5 Months",
            "6 Months"
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
