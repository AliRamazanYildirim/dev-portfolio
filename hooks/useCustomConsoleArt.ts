import { useEffect } from "react";

export const useCustomConsoleArt = (asciiText?: string) => {
  useEffect(() => {
    // Eğer custom ASCII art verilmişse onu kullan, yoksa default logo kullan
    const art = asciiText || getDefaultArt();

    // ASCII art'i console'a yaz - styles ile formatla
    const styles = {
      title: "color: #6366f1; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #6366f1;",
      name: "color: #8b5cf6; font-size: 16px; font-weight: bold;",
      role: "color: #ec4899; font-size: 14px; font-weight: 600;",
      link: "color: #06b6d4; font-size: 12px; text-decoration: underline; cursor: pointer;",
      email: "color: #10b981; font-size: 12px;",
      tech: "color: #f59e0b; font-size: 12px;",
      cta: "color: #06b6d4; font-size: 12px; font-weight: bold;",
      section: "color: #6366f1; font-size: 13px; font-weight: bold; border-bottom: 2px solid #6366f1; padding-bottom: 5px;",
    };

    console.clear();
    console.log("%c" + art, "color: #6366f1; font-family: 'Courier New', monospace;");
    console.log("");

    console.log("%c✨ Welcome to My Portfolio!", styles.title);
    console.log("%c👋 Hi, I'm Ali Ramazan Yildirim", styles.name);
    console.log("%c💼 Fullstack Developer & UI/UX Designer", styles.role);
    console.log("");

    // İletişim bilgileri bölümü
    console.log("%c📞 CONTACT", styles.section);
    console.log(
      "%c🌐 Website: https://dev-portfolio-eight-khaki.vercel.app",
      styles.link
    );
    console.log("%c📧 Email: aliramazanyildirim@gmail.com", styles.email);
    console.log("%c📱 Phone: +49 151 67145187", styles.email);
    console.log(
      "%c🐙 GitHub: https://github.com/AliRamazanYildirim",
      styles.link
    );
    console.log("");

    // Tech Stack bölümü
    console.log("%c�️  TECH STACK", styles.section);
    const techStack = [
      { category: "Frontend", techs: "React • Next.js • TypeScript • Tailwind CSS • Framer Motion" },
      { category: "Backend", techs: "Node.js • Express • Next.js API Routes • Prisma • MongoDB" },
      { category: "Database", techs: "MongoDB • Prisma ORM • Supabase" },
      { category: "Tools", techs: "Git • Vercel • GitHub • Docker • Figma" },
    ];

    techStack.forEach((item) => {
      console.log(`%c${item.category}: %c${item.techs}`, "color: #8b5cf6; font-weight: bold;", "color: #f59e0b;");
    });
    console.log("");

    // Özel mesaj
    console.log(
      "%c💡 Always learning, always building. Let's create something amazing!",
      styles.cta
    );
    console.log(
      "%c🚀 Interested in collaborating? Feel free to reach out!",
      styles.cta
    );
    console.log("");

    // Sosyal medya tablosu
    console.table({
      "LinkedIn": "linkedin.com/in/aliramazanyildirim",
      "GitHub": "github.com/AliRamazanYildirim",
      "Twitter": "@AliRamazanDev",
      "Portfolio": "dev-portfolio-eight-khaki.vercel.app",
    });
  }, [asciiText]);
};

function getDefaultArt(): string {
  return `
    ███╗   ███╗██╗   ██╗███████╗████████╗███████╗██████╗ ██╗   ██╗███╗   ███╗
    ████╗ ████║██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║   ██║████╗ ████║
    ██╔████╔██║██║   ██║███████╗   ██║   █████╗  ██████╔╝██║   ██║██╔████╔██║
    ██║╚██╔╝██║██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║
    ██║ ╚═╝ ██║╚██████╔╝███████║   ██║   ███████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║
    ╚═╝     ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
  `;
}
