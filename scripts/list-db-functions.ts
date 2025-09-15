import { db } from '@/lib/db';

async function run() {
    try {
        const rows: any = await db.$queryRaw`SELECT n.nspname as schema, p.proname as name, pg_get_functiondef(p.oid) as definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname ILIKE '%rate%' OR p.proname ILIKE '%hit%'
      ORDER BY n.nspname, p.proname;`;

        console.log('functions:', rows);
    } catch (err) {
        console.error('error listing functions:', err);
        process.exit(1);
    }
    process.exit(0);
}
run();
