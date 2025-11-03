"use client";

import { useCustomConsoleArt } from "@/hooks/useCustomConsoleArt";
// İsterseniz şunu da import edebilirsiniz:
// import { useAsciiArtFromFile } from "@/hooks/useAsciiArtFromFile";

export function ConsoleGreeting() {
  // Default console art hook
  useCustomConsoleArt();

  // Eğer harici ASCII art dosyasını kullanmak istiyorsanız:
  // useAsciiArtFromFile();

  return null; // Bu component sadece console'a log yazmak için
}
