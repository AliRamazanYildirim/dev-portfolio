import { File } from "node:buffer";

(process.env as Record<string, string | undefined>).NODE_ENV = "test";

if (typeof globalThis.File === "undefined") {
    globalThis.File = File as unknown as typeof globalThis.File;
}
