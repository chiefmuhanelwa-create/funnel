import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, discountCodes } from '../../lib/db';
import { eq, and } from 'drizzle-orm';

// Fallback discount codes (used when database is not available or codes not seeded)
const FALLBACK_DISCOUNT_CODES: Record<string, {
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  appliesTo: string;
  minPurchase?: number;
}> = {
  'SAVE10': { discountType: 'percentage', discountValue: 10, appliesTo: 'all' },
  'SPECIAL10': { discountType: 'percentage', discountValue: 10, appliesTo: 'all' },
  'FIRSTTIME20': { discountType: 'percentage', discountValue: 20, appliesTo: 'all' },
  'EARLYBIRD': { discountType: 'fixed', discountValue: 1000, appliesTo: 'starter-kit', minPurchase: 5000 },
  'NOCHILL': { discountType: 'percentage', discountValue: 15, appliesTo: 'all' },
};

// Helper function to validate using fallback codes
function validateFallbackCode(
  normalizedCode: string,
  productKeys: string[],
  subtotal: number
): { valid: boolean; error?: string; data?: any } {
  const fallbackCode = FALLBACK_DISCOUNT_CODES[normalizedCode];

  if (!fallbackCode) {
    return { valid: false, error: 'Invalid discount code' };
  }

  // Check minimum purchase
  if (fallbackCode.minPurchase && subtotal < fallbackCode.minPurchase) {
    const minRequired = (fallbackCode.minPurchase / 100).toFixed(2);
    return { valid: false, error: `Minimum purchase of $${minRequired} required` };
  }

  // Check product applicability
  if (fallbackCode.appliesTo !== 'all') {
    const appliesTo = fallbackCode.appliesTo.split(',').map(s => s.trim());
    const hasApplicableProduct = productKeys.some((key: string) => appliesTo.includes(key));

    if (!hasApplicableProduct) {
      return { valid: false, error: "This code doesn't apply to selected products" };
    }
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (fallbackCode.discountType === 'percentage') {
    discountAmount = Math.floor(subtotal * fallbackCode.discountValue / 100);
  } else {
    discountAmount = Math.min(fallbackCode.discountValue, subtotal);
  }

  return {
    valid: true,
    data: {
      code: normalizedCode,
      discount_type: fallbackCode.discountType,
      discount_value: fallbackCode.discountValue,
      discount_amount: discountAmount,
      final_total: subtotal - discountAmount,
    }
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, productKeys, subtotal } = req.body;

    if (!code || !productKeys || subtotal === undefined) {
      return res.status(400).json({ valid: false, error: 'Missing required fields' });
    }

    const normalizedCode = code.toUpperCase().trim();

    // Try database first if available
    if (process.env.DATABASE_URL) {
      try {
        const [discountCode] = await db
          .select()
          .from(discountCodes)
          .where(
            and(
              eq(discountCodes.code, normalizedCode),
              eq(discountCodes.isActive, true)
            )
          )
          .limit(1);

        if (discountCode) {
          // Check expiration
          if (discountCode.expiresAt) {
            const expiryDate = new Date(discountCode.expiresAt);
            if (expiryDate < new Date()) {
              return res.status(400).json({ valid: false, error: 'This code has expired' });
            }
          }

          // Check max uses
          if (discountCode.maxUses !== null && discountCode.currentUses !== null) {
            if (discountCode.currentUses >= discountCode.maxUses) {
              return res.status(400).json({ valid: false, error: 'This code has reached its usage limit' });
            }
          }

          // Check minimum purchase
          if (discountCode.minPurchase && subtotal < discountCode.minPurchase) {
            const minRequired = (discountCode.minPurchase / 100).toFixed(2);
            return res.status(400).json({
              valid: false,
              error: `Minimum purchase of $${minRequired} required`,
            });
          }

          // Check product applicability
          if (discountCode.appliesTo && discountCode.appliesTo !== 'all') {
            const appliesTo = discountCode.appliesTo.split(',').map(s => s.trim());
            const hasApplicableProduct = productKeys.some((key: string) =>
              appliesTo.includes(key)
            );

            if (!hasApplicableProduct) {
              return res.status(400).json({
                valid: false,
                error: "This code doesn't apply to selected products",
              });
            }
          }

          // Calculate discount amount
          let discountAmount = 0;

          if (discountCode.discountType === 'percentage') {
            discountAmount = Math.floor(subtotal * discountCode.discountValue / 100);
          } else {
            // Fixed amount
            discountAmount = Math.min(discountCode.discountValue, subtotal);
          }

          console.log(`[DISCOUNT] Code ${normalizedCode} validated from DB: -$${(discountAmount / 100).toFixed(2)}`);

          return res.status(200).json({
            valid: true,
            code: discountCode.code,
            discount_type: discountCode.discountType,
            discount_value: discountCode.discountValue,
            discount_amount: discountAmount,
            final_total: subtotal - discountAmount,
          });
        }
      } catch (dbError) {
        console.warn('[DISCOUNT] Database error, falling back to static codes:', dbError);
        // Continue to fallback validation
      }
    }

    // Fallback to static discount codes
    const fallbackResult = validateFallbackCode(normalizedCode, productKeys, subtotal);

    if (!fallbackResult.valid) {
      return res.status(400).json({ valid: false, error: fallbackResult.error });
    }

    console.log(`[DISCOUNT] Code ${normalizedCode} validated from fallback: -$${(fallbackResult.data.discount_amount / 100).toFixed(2)}`);

    return res.status(200).json({
      valid: true,
      ...fallbackResult.data,
    });

  } catch (error) {
    console.error('[DISCOUNT] Validation error:', error);

    // Last resort: try fallback codes even on error
    try {
      const { code, productKeys, subtotal } = req.body;
      const normalizedCode = code?.toUpperCase()?.trim();

      if (normalizedCode && productKeys && subtotal !== undefined) {
        const fallbackResult = validateFallbackCode(normalizedCode, productKeys, subtotal);

        if (fallbackResult.valid) {
          console.log(`[DISCOUNT] Code ${normalizedCode} validated from fallback (error recovery)`);
          return res.status(200).json({
            valid: true,
            ...fallbackResult.data,
          });
        }

        return res.status(400).json({ valid: false, error: fallbackResult.error || 'Invalid discount code' });
      }
    } catch (fallbackError) {
      console.error('[DISCOUNT] Fallback also failed:', fallbackError);
    }

    return res.status(500).json({ valid: false, error: 'Failed to validate code' });
  }
}
