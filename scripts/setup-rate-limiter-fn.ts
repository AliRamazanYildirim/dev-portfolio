import { db } from '@/lib/db';

async function run() {
    try {
        console.log('Creating rate_limit_counters table if not exists...');
        await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS public.rate_limit_counters (
        key text PRIMARY KEY,
        count bigint NOT NULL,
        window_start bigint NOT NULL
      );
    `;

        console.log('Creating or replacing hit_rate_limit function...');
        await db.$executeRaw`
      CREATE OR REPLACE FUNCTION public.hit_rate_limit(p_key text, p_window_seconds bigint, p_limit bigint)
      RETURNS TABLE(success boolean, lim bigint, remaining bigint, reset_at bigint)
      LANGUAGE plpgsql
      AS $$
      DECLARE
        now_ts bigint := (extract(epoch from now())::bigint);
        bucket_start bigint := now_ts - (now_ts % p_window_seconds);
        cur_count bigint;
      BEGIN
        LOOP
          UPDATE public.rate_limit_counters
          SET count = CASE WHEN window_start = bucket_start THEN count + 1 ELSE 1 END,
              window_start = bucket_start
          WHERE key = p_key
          RETURNING count INTO cur_count;
          IF FOUND THEN
            EXIT;
          END IF;
          BEGIN
            INSERT INTO public.rate_limit_counters(key, count, window_start) VALUES (p_key,1,bucket_start);
            cur_count := 1;
            EXIT;
          EXCEPTION WHEN unique_violation THEN
            -- concurrent insert, retry
          END;
        END LOOP;

        success := (cur_count <= p_limit);
        lim := p_limit;
        remaining := GREATEST(p_limit - cur_count, 0);
        reset_at := bucket_start + p_window_seconds;
        RETURN NEXT;
      END;
      $$;
    `;

        console.log('Rate limiter function created.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to create rate limiter function:', err);
        process.exit(1);
    }
}

run();
