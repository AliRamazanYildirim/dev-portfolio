#!/usr/bin/env bun
import bcrypt from "bcryptjs";

async function main() {
    const [, , input, hash] = process.argv;

    if (!input) {
        console.log("Usage: bun run scripts/test-bcrypt-compare.ts <plaintext> [hash]");
        process.exit(1);
    }

    if (!hash) {
        console.log("No hash provided — generating a hash for the given input...");
        const generated = await bcrypt.hash(input, 12);
        console.log("Generated hash:", generated);
        const match = await bcrypt.compare(input, generated);
        console.log("Compare result (should be true):", match);
        process.exit(match ? 0 : 2);
    }

    // If hash provided, compare directly
    try {
        const match = await bcrypt.compare(input, hash);
        console.log("Compare result:", match);
        process.exit(match ? 0 : 2);
    } catch (err) {
        console.error("Error comparing:", err);
        process.exit(3);
    }
}

main();
