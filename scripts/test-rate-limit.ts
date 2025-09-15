import { db } from "@/lib/db";

async function run() {
    try {
        const key = 'ip:127.0.0.1:/api/contact:GET';
        const window = 60;
        const limit = 60;
        const rows: any = await db.$queryRaw`
      SELECT * FROM hit_rate_limit(${key}::text, ${window}::bigint, ${limit}::bigint)`;
        console.log('rows:', rows);
        const row = Array.isArray(rows) ? rows[0] : rows;
        console.log('row:', row);
        process.exit(0);
    } catch (err) {
        console.error('error running rpc via prisma:', err);
        process.exit(1);
    }
}

run();
