import { useEffect } from "react";

/**
 * Harici ASCII art dosyasından okuma ve console'a yazdırma
 * Medium stili console mesajları ile
 */
export const useAsciiArtFromFile = () => {
  useEffect(() => {
    const fetchAndDisplayArt = async () => {
      try {
        // ASCII art dosyasını fetch et
        const response = await fetch("/ascii-art.txt");
        const asciiArt = await response.text();

        // Styles
        const styles = {
          title: "color: #6366f1; font-size: 18px; font-weight: bold;",
          section: "color: #6366f1; font-size: 13px; font-weight: bold; border-bottom: 2px solid #6366f1;",
          text: "color: #475569; font-size: 12px;",
          link: "color: #06b6d4; font-size: 12px; text-decoration: underline;",
          tech: "color: #f59e0b; font-size: 12px;",
        };

        console.clear();
        
        // ASCII art'i console'a yaz
        console.log("%c" + asciiArt, "color: #6366f1; font-family: monospace; font-size: 8px; line-height: 1;");
        console.log("");

        console.log("%c✨ Welcome! Full Stack Web Developer", styles.title);
        console.log("%c" + "─".repeat(50), "color: #e2e8f0;");
        
        console.log("%cName: Ali Ramazan Yildirim", styles.text);
        console.log("%cRole: Fullstack Developer & UI/UX Designer", styles.text);
        console.log(
          "%cWebsite: https://dev-portfolio-eight-khaki.vercel.app",
          styles.link
        );
        console.log("%cEmail: aliramazanyildirim@gmail.com", styles.text);
        console.log("%cGitHub: https://github.com/AliRamazanYildirim", styles.link);
        console.log("");

        console.log("%c🎯 EXPERTISE", styles.section);
        console.log(
          "%c• Full-stack web development (Frontend & Backend)",
          styles.tech
        );
        console.log("%c• React, Next.js, TypeScript", styles.tech);
        console.log("%c• MongoDB, Prisma, API Design", styles.tech);
        console.log("%c• UI/UX Design & Responsive Development", styles.tech);
        console.log("");

        console.log(
          "%c💼 Open for freelance projects & collaborations!",
          "color: #10b981; font-size: 13px; font-weight: bold;"
        );
      } catch (error) {
        console.error("Failed to load ASCII art:", error);
      }
    };

    fetchAndDisplayArt();
  }, []);
};
