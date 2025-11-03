/**
 * CONSOLE ART IMPLEMENTASYON REHBERI
 * 
 * Tarayıcıda F12 tuşu ile DevTools'u açtıktan sonra Console sekmesine gidin.
 * Aşağıdaki loglar görünecektir:
 * 
 * 1. ASCII Art Logo (renkli)
 * 2. Welcome mesajı
 * 3. İletişim bilgileri
 * 4. Tech Stack (kategorili)
 * 5. Sosyal medya tablosu (console.table)
 * 
 * ÖZELLEŞTIRME SEÇENEKLERİ:
 */

// OPTION 1: Default console art hook kullan
// hooks/useCustomConsoleArt.ts dosyası var

// OPTION 2: Harici ASCII art dosyasını kullan
// hooks/useAsciiArtFromFile.ts dosyası var - /public/ascii-art.txt dosyasını okur

// OPTION 3: Custom console hook oluştur
// Example:
/*
export const useMyCustomConsoleArt = () => {
  useEffect(() => {
    const myAsciiArt = `
      BURAYA KENDİ ASCII ARTINI KOY
    `;

    console.log("%c" + myAsciiArt, "color: #YOUR_COLOR; font-family: monospace;");
    console.log("%cMy Custom Message", "color: #YOUR_COLOR; font-size: 16px;");
  }, []);
};
*/

// MEDIUM STİLİ CONSOLE MESAJLARI:
// - %c kullanarak style ekleyebilirsiniz
// - console.table() ile tablolar gösterebilirsiniz
// - console.group() ile mesajları gruplayabilirsiniz
// - console.log(), console.warn(), console.error() ile farklı seviyeler

// RENK PALETİ (Tailwind):
const colors = {
  indigo: "#6366f1",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  green: "#10b981",
  amber: "#f59e0b",
  gray: "#475569",
  slate: "#1e293b",
};

// ÖRNEK: Kendi Custom Hook'u
/*
import { useEffect } from "react";

export const useAdvancedConsoleArt = () => {
  useEffect(() => {
    const clearPrevious = () => console.clear();
    
    const logWithStyle = (text, color = colors.indigo, size = "12px", weight = "normal") => {
      console.log(`%c${text}`, `color: ${color}; font-size: ${size}; font-weight: ${weight};`);
    };

    clearPrevious();
    
    logWithStyle("MERHABA!", colors.indigo, "18px", "bold");
    logWithStyle("Bu benim portfolio sitemdir", colors.purple);
    
    // Tablo ile sosyal medya
    console.table({
      GitHub: "AliRamazanYildirim",
      Email: "aliramazanyildirim@gmail.com",
      LinkedIn: "aliramazanyildirim",
    });
  }, []);
};
*/

export {};
