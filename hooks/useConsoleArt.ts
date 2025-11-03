import { useEffect } from "react";

export const useConsoleArt = () => {
  useEffect(() => {
    // ASCII Art Logo
    const asciiArt = `
    ███╗   ███╗██╗   ██╗███████╗████████╗███████╗██████╗ ██╗   ██╗███╗   ███╗
    ████╗ ████║██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║   ██║████╗ ████║
    ██╔████╔██║██║   ██║███████╗   ██║   █████╗  ██████╔╝██║   ██║██╔████╔██║
    ██║╚██╔╝██║██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║
    ██║ ╚═╝ ██║╚██████╔╝███████║   ██║   ███████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║
    ╚═╝     ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
    `;

    // Renkli mesajlar
    const messages = [
      {
        text: "🚀 Welcome to My Portfolio!",
        style: "color: #6366f1; font-size: 18px; font-weight: bold;",
      },
      {
        text: "👋 Hi, I'm Ali Ramazan Yildirim",
        style: "color: #8b5cf6; font-size: 16px; font-weight: bold;",
      },
      {
        text: "💼 Fullstack Developer & UI/UX Designer",
        style: "color: #ec4899; font-size: 14px;",
      },
      {
        text: "🌐 https://dev-portfolio-eight-khaki.vercel.app",
        style: "color: #06b6d4; font-size: 12px; text-decoration: underline;",
      },
      {
        text: "📧 aliramazanyildirim@gmail.com",
        style: "color: #10b981; font-size: 12px;",
      },
      {
        text: "🐙 GitHub: https://github.com/AliRamazanYildirim",
        style: "color: #1f2937; font-size: 12px;",
      },
    ];

    // ASCII art'i console'a yaz
    console.log("%c" + asciiArt, "color: #6366f1; font-family: monospace; font-weight: bold;");

    // Mesajları console'a yaz
    messages.forEach((msg) => {
      console.log("%c" + msg.text, msg.style);
    });

    // Ek bilgiler
    console.log(
      "%c📝 Made with React, Next.js, TypeScript, Tailwind CSS & MongoDB",
      "color: #f59e0b; font-size: 12px;"
    );

    console.log(
      "%c👨‍💻 Want to collaborate? Let's build something amazing together!",
      "color: #06b6d4; font-size: 12px; font-weight: bold;"
    );
  }, []);
};
