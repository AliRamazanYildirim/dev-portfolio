// Auto-generated from translations.ts to keep heavy legal copy out of the core client bundle.

const basePrivacyTranslations = {
  en: {
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
    } as const,
  de: {
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
    } as const,
  tr: {
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
    } as const,
} as const;

export const privacyTranslations = {
  ...basePrivacyTranslations,
  fr: {
    "title": "politique de confidentialité",
    "lastUpdated": "Dernière mise à jour : 17 octobre 2025",
    "intro": [
      "Cette politique de confidentialité explique comment je traite les données personnelles lorsque vous interagissez avec l'application dev-portfolio, ses API et les services connectés.",
      "L'application propose un contenu multilingue (anglais, allemand, turc) et est principalement destinée aux clients situés en Allemagne, dans l'UE et en Turquie. Dans la mesure du possible, nous nous conformons au règlement général sur la protection des données (RGPD) de l'UE et à la loi allemande applicable."
    ],
    "sections": [
      {
        "heading": "1. Contrôleur",
        "paragraphs": [
          "Ali Ramazan Yildirim, Hebelstraße 1, 77880 Sasbach, Deuschland, e-mail : aliramazanyildirim@gmail.com, téléphone : +49 151 67145187, agit en tant que responsable du traitement pour tous les traitements décrits ici.",
          "Pour les résidents de l'UE/EEE, vous pouvez également adresser vos demandes à notre adresse de correspondance allemande sur demande ; nous vous répondrons dans les délais légaux."
        ]
      },
      {
        "heading": "2. Données personnelles que nous traitons",
        "paragraphs": [
          "Nous traitons uniquement les données que vous fournissez activement ou qui sont techniquement nécessaires au fonctionnement de ce portefeuille."
        ],
        "bullets": [
          "Coordonnées (nom, adresse e-mail, contenu du message) soumises via le formulaire de contact à l'adresse /api/contact ; stocké avec des métadonnées d'horodatage et de limiteur de débit dans notre base de données MongoDB.",
          "Dossiers clients créés via la zone d'administration (/api/admin/customers) : prénom et nom, entreprise, adresse postale, numéro de téléphone, email, codes de parrainage, notes de projet, tarification, discountRate, finalPrice, ReferCount et horodatages.",
          "Transactions du programme de parrainage enregistrées via les enregistrements ReferralTransaction, y compris referrerCode, discountRate (3/6/9%), le niveau de parrainage et l'ID client lié.",
          "Informations sur la facture produites avec le générateur de facture (InvoiceService), telles que le numéro de facture, les livrables, les descriptions de projet, les calculs de TVA et les références de paiement.",
          "Données d'authentification des administrateurs (e-mail, mot de passe haché, jeton de session stocké sous le cookie httpOnly « admin-auth-token »).",
          "Métadonnées techniques telles que l'adresse IP (conservée brièvement par la clé du limiteur de débit), les en-têtes du navigateur et les journaux du serveur nécessaires pour sécuriser le service."
        ]
      },
      {
        "heading": "3. Finalités et bases juridiques",
        "bullets": [
          "Répondre aux demandes de contact et préparer des propositions (Art. 6(1)(b) RGPD).",
          "Administration des comptes clients, des récompenses de parrainage et des livrables du projet (Art. 6(1)(b) et 6(1)(f) du RGPD).",
          "Générer des factures et remplir les obligations légales de comptabilité (article 6, paragraphe 1, point c) du RGPD).",
          "Envoi de notifications de référencement et de rappels par e-mail à l'aide de nodemailer (intérêt légitime, art. 6(1)(f) du RGPD).",
          "Atténuer les abus, faire respecter les limites de tarifs et défendre nos systèmes (intérêt légitime, art. 6(1)(f) du RGPD).",
          "Se conformer aux obligations légales ou aux demandes des autorités (article 6, paragraphe 1, point c) du RGPD)."
        ]
      },
      {
        "heading": "4. Rétention",
        "bullets": [
          "Les demandes de contact sont conservées jusqu'à 12 mois après leur achèvement, sauf conclusion d'un nouveau contrat.",
          "Les données des clients et des références sont conservées pendant toute la durée de notre relation commerciale, plus jusqu'à 3 ans pour les délais de prescription, à moins que la loi comptable n'exige une conservation plus longue.",
          "Les informations relatives aux factures sont conservées pendant 10 ans conformément aux règles allemandes de conservation commerciale et fiscale.",
          "Les entrées du limiteur de débit contenant des clés basées sur IP expirent automatiquement dans la fenêtre configurée (60 secondes) et sont ensuite supprimées.",
          "Les journaux du serveur et de sécurité sont purgés dans les 90 jours, sauf s'ils font partie d'une enquête sur un incident."
        ]
      },
      {
        "heading": "5. Destinataires et sous-traitants",
        "bullets": [
          "Fournisseurs d'hébergement et de déploiement utilisés pour le portefeuille en direct (par exemple Vercel ou plates-formes cloud comparables).",
          "Hébergement de base de données avec MongoDB Atlas ou un autre fournisseur défini par la variable d'environnement MONGODB_URI.",
          "Transmission d'e-mails via Gmail SMTP ou, en développement, comptes de test Ethereal exploités par nodemailer.",
          "Cloudinary pour le stockage multimédia et la livraison d'actifs réactifs lorsque vous téléchargez des images via /api/upload.",
          "Fournisseurs de services de paiement (par exemple banques, PayPal) si vous versez les montants des factures en utilisant les méthodes répertoriées.",
          "Conseillers professionnels ou autorités lorsque la loi l’exige."
        ]
      },
      {
        "heading": "6. Transferts internationaux",
        "paragraphs": [
          "Les données peuvent être traitées en Turquie, dans l'UE/EEE et dans d'autres juridictions où nos sous-traitants opèrent (notamment les États-Unis pour Cloudinary et Gmail).",
          "Lors d'un transfert en dehors de l'UE/EEE, nous nous appuyons sur des garanties appropriées telles que des clauses contractuelles types ou des garanties équivalentes fournies par le prestataire de services concerné."
        ]
      },
      {
        "heading": "7. Sécurité",
        "bullets": [
          "Transport chiffré (HTTPS) pour les points de terminaison publics et les interfaces d'administration.",
          "Accès administratif étendu protégé par les cookies JWT et httpOnly.",
          "Limitation du débit et limitation IP mises en œuvre via mongoRateLimiter pour lutter contre les abus.",
          "Maintenance régulière des dépendances et surveillance des journaux du serveur pour détecter les anomalies."
        ]
      },
      {
        "heading": "8. Vos droits",
        "bullets": [
          "Accès à vos données personnelles (Art. 15 RGPD).",
          "Rectification des données inexactes (art. 16 RGPD).",
          "Effacement (art. 17 RGPD) et restriction (art. 18 RGPD) dans les limites légales.",
          "Portabilité des données que vous nous avez fournies (Art. 20 RGPD).",
          "Objection au traitement fondée sur des intérêts légitimes (article 21 du RGPD).",
          "Retrait du consentement avec effet pour l'avenir, lorsque le traitement repose sur le consentement.",
          "Droit de déposer une plainte auprès d'une autorité de contrôle, notamment en Allemagne (LfDI Baden-Württemberg) ou de votre autorité locale."
        ]
      },
      {
        "heading": "9. Exercer vos droits",
        "paragraphs": [
          "Veuillez nous contacter en utilisant les coordonnées ci-dessous. Nous pouvons demander une preuve d'identité pour protéger vos données. Les réponses sont apportées sans retard excessif et dans les délais fixés par la loi."
        ]
      },
      {
        "heading": "10. Projets clients et vitrine des logos des partenaires",
        "paragraphs": [
          "Dans le cadre de mon service de portfolio professionnel, je présente les projets que j'ai développés pour les clients et j'affiche les logos des partenaires dans la section partenaires de mon site Web.",
          "Cette vitrine sert de référence aux clients potentiels pour comprendre la qualité et la portée de mon travail, et pour démontrer des relations professionnelles avec des partenaires établis."
        ],
        "bullets": [
          "Vitrine du projet : avec le consentement écrit explicite de chaque client, j'affiche les détails du projet, notamment les descriptions, les technologies utilisées, les captures d'écran et les résultats du projet. Les noms des clients et les informations sur l’entreprise ne sont affichés que lorsque cela est expressément autorisé.",
          "Logos des partenaires : les logos des entreprises partenaires sont affichés dans la section des partenaires uniquement après avoir obtenu une autorisation explicite via un accord écrit ou une clause contractuelle. Les logos sont utilisés uniquement dans le but de démontrer des collaborations professionnelles.",
          "Contrôle client : les clients conservent le droit de demander la suppression ou la modification des informations ou des logos de leur projet à tout moment en me contactant directement. Ces demandes seront traitées dans un délai de 7 jours ouvrables.",
          "Informations confidentielles : aucune information commerciale confidentielle, code propriétaire ou donnée sensible n'est jamais publié sans autorisation écrite explicite. Tous les documents de présentation sont soumis à l'examen et à l'approbation du client avant publication.",
          "Base juridique : Ces activités de démonstration sont menées conformément à l'art. 6, paragraphe 1, point a) du RGPD (consentement) et art. 6, paragraphe 1, point f) du RGPD (intérêt légitime à présenter un travail professionnel), le consentement du client étant toujours prioritaire."
        ]
      },
      {
        "heading": "11. Mises à jour",
        "paragraphs": [
          "Nous mettrons à jour cette politique de confidentialité chaque fois que nos services ou nos obligations légales changeront. La version actuelle est toujours disponible sur /privacy."
        ]
      }
    ],
    "contactHeading": "Contact pour les demandes de confidentialité",
    "contactDetails": [
      "Ali Ramazan Yildirim",
      "Adresse : Hebelstraße 1, 77880 Sasbach, Allemagne",
      "Courriel : aliramazanyildirim@gmail.com",
      "Téléphone : +49 151 67145187"
    ],
    "note": "Si les traductions diffèrent, la version anglaise prévaut. La protection des consommateurs locaux reste inchangée."
  } as const,
} as const;

export type PrivacyDictionary = (typeof privacyTranslations)[keyof typeof privacyTranslations];
