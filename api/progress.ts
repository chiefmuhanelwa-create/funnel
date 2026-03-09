import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { handleProgressMilestone } from '../lib/resend';

// Course lesson counts for milestone detection
const COURSE_LESSON_COUNTS: Record<string, number> = {
  'starter-kit': 10, // 10 modules (0-9)
  'content-foundations': 3,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(databaseUrl);

  // GET: Fetch user's progress
  if (req.method === 'GET') {
    try {
      const email = req.query.email as string;
      const productKey = req.query.product_key as string;

      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      let progress;
      if (productKey) {
        progress = await sql`
          SELECT lesson_id, completed, completed_at
          FROM user_progress
          WHERE customer_email = ${email.toLowerCase()}
            AND product_key = ${productKey}
          ORDER BY lesson_id
        `;
      } else {
        progress = await sql`
          SELECT product_key, lesson_id, completed, completed_at
          FROM user_progress
          WHERE customer_email = ${email.toLowerCase()}
          ORDER BY product_key, lesson_id
        `;
      }

      // Calculate stats
      const completedCount = progress.filter((p: any) => p.completed).length;
      const totalLessons = productKey ? (COURSE_LESSON_COUNTS[productKey] || 0) : 0;

      return res.status(200).json({
        success: true,
        progress,
        stats: {
          completed: completedCount,
          total: totalLessons,
          percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        },
      });
    } catch (error: any) {
      console.error('[PROGRESS] GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  // POST: Update progress
  if (req.method === 'POST') {
    try {
      const { email, product_key, lesson_id, completed } = req.body;

      if (!email || !product_key || lesson_id === undefined) {
        return res.status(400).json({ error: 'Missing required fields: email, product_key, lesson_id' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const isCompleted = completed === true || completed === 'true';

      // Upsert progress record
      if (isCompleted) {
        await sql`
          INSERT INTO user_progress (customer_email, product_key, lesson_id, completed, completed_at)
          VALUES (${normalizedEmail}, ${product_key}, ${lesson_id}, true, NOW())
          ON CONFLICT (customer_email, product_key, lesson_id)
          DO UPDATE SET completed = true, completed_at = NOW()
        `;
      } else {
        await sql`
          INSERT INTO user_progress (customer_email, product_key, lesson_id, completed, completed_at)
          VALUES (${normalizedEmail}, ${product_key}, ${lesson_id}, false, NULL)
          ON CONFLICT (customer_email, product_key, lesson_id)
          DO UPDATE SET completed = false, completed_at = NULL
        `;
      }

      console.log(`[PROGRESS] Updated: ${normalizedEmail} - ${product_key} - lesson ${lesson_id} = ${isCompleted}`);

      // Check for milestones and send Resend emails/add to audiences
      if (isCompleted) {
        const allProgress = await sql`
          SELECT COUNT(*) as total,
                 SUM(CASE WHEN completed THEN 1 ELSE 0 END)::int as completed_count
          FROM user_progress
          WHERE customer_email = ${normalizedEmail} AND product_key = ${product_key}
        `;

        const { completed_count } = allProgress[0];
        const totalLessons = COURSE_LESSON_COUNTS[product_key] || 0;

        // Trigger milestone emails and audience updates
        try {
          if (completed_count === 1) {
            await handleProgressMilestone(normalizedEmail, 'first_lesson');
          } else if (completed_count >= totalLessons && totalLessons > 0) {
            await handleProgressMilestone(normalizedEmail, 'all_complete');
          }
        } catch (milestoneError) {
          console.error('[PROGRESS] Milestone error (non-fatal):', milestoneError);
        }
      }

      return res.status(200).json({
        success: true,
        message: `Progress ${isCompleted ? 'marked complete' : 'unmarked'}`
      });
    } catch (error: any) {
      console.error('[PROGRESS] POST error:', error);
      return res.status(500).json({ error: 'Failed to update progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
