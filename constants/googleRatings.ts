export interface GoogleRating {
    id: string;
    businessName: string;
    rating: number;
    reviewText: string;
    verificationDate: string;
    positivePercentage: number;
    googleProfileUrl?: string;
    badges: string[];
}

export interface GoogleRatingsContent {
    heading: string;
    subheading: string;
    verified: string;
    reviews: string;
    seeMore: string;
    ratings: GoogleRating[];
}

export const enGoogleRatings: GoogleRatingsContent = {
    heading: "Trusted by Businesses",
    subheading: "See what my clients say about my services",
    verified: "Verified on Google",
    reviews: "reviews",
    seeMore: "See all reviews on Google",
    ratings: [
        {
            id: "rating-1",
            businessName: "KARACA",
            rating: 5,
            reviewText: "Exceptional web development services! The team was professional, responsive, and delivered everything on time. Highly recommend!",
            verificationDate: "2025-10-15",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },
        {
            id: "rating-2",
            businessName: "kingnetz.de",
            rating: 5,
            reviewText: "Amazing design and functionality! They perfectly understood our requirements and delivered excellent results that exceeded expectations.",
            verificationDate: "2025-09-28",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified"],
        },
        {
            id: "rating-3",
            businessName: "SARA BAU",
            rating: 5,
            reviewText: "Best decision for our online presence! The team was incredibly supportive throughout the entire process. Very professional!",
            verificationDate: "2025-10-22",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },

    ],
};

export const deGoogleRatings: GoogleRatingsContent = {
    heading: "Von Unternehmen vertraut",
    subheading: "Sehen Sie, was meine Kunden über meine Dienstleistungen sagen",
    verified: "Bei Google verifiziert",
    reviews: "Bewertungen",
    seeMore: "Alle Bewertungen auf Google ansehen",
    ratings: [
        {
            id: "rating-1",
            businessName: "KARACA",
            rating: 5,
            reviewText: "Hervorragende Webentwicklungsdienste! Das Team war professionell, reaktionsschnell und lieferte alles pünktlich. Sehr empfehlenswert!",
            verificationDate: "2025-10-15",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },
        {
            id: "rating-2",
            businessName: "kingnetz.de",
            rating: 5,
            reviewText: "Wunderbare Gestaltung und Funktionalität! Sie verstanden unsere Anforderungen perfekt und lieferten ausgezeichnete Ergebnisse.",
            verificationDate: "2025-09-28",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified"],
        },
        {
            id: "rating-3",
            businessName: "SARA BAU",
            rating: 5,
            reviewText: "Die beste Entscheidung für unsere Online-Präsenz. Das Team war während des gesamten Prozesses äußerst unterstützend!",
            verificationDate: "2025-10-22",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },

    ],
};

export const trGoogleRatings: GoogleRatingsContent = {
    heading: "İşletmeler Tarafından Güvenilir",
    subheading: "Müşterilerimin hizmetlerim hakkında neler söylediğini görün",
    verified: "Google'da Doğrulanmış",
    reviews: "değerlendirme",
    seeMore: "Google'da tüm yorumları gör",
    ratings: [
        {
            id: "rating-1",
            businessName: "KARACA",
            rating: 5,
            reviewText: "Olağanüstü web geliştirme hizmetleri! Takım profesyonel, çok hızlı yanıt verdi ve her şeyi zamanında teslim etti. Kesinlikle tavsiye ederim!",
            verificationDate: "2025-10-15",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },
        {
            id: "rating-2",
            businessName: "kingnetz.de",
            rating: 5,
            reviewText: "Harika tasarım ve işlevsellik! İhtiyaçlarımızı mükemmel şekilde anladılar ve beklentilerimizi aşan sonuçlar verdiler.",
            verificationDate: "2025-09-28",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified"],
        },
        {
            id: "rating-3",
            businessName: "SARA BAU",
            rating: 5,
            reviewText: "Çevrimiçi varlığımız için en iyi karar! Takım tüm süreç boyunca çok destekleyici ve yardımcı oldu.",
            verificationDate: "2025-10-22",
            positivePercentage: 100,
            googleProfileUrl: "https://www.google.com/maps/place/ARY+Tech+Solutions/@48.644612,8.0867801,17z/data=!3m1!4b1!4m6!3m5!1s0x4796d9f3ec334a07:0x23557441b543c6fd!8m2!3d48.644612!4d8.0867801!16s%2Fg%2F11ylwkp1d5?hl=de&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
            badges: ["verified", "recommended"],
        },

    ],
};
