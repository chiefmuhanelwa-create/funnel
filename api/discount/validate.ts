import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, discountCodes } from '../../lib/db';
import { eq, and } from 'drizzle-orm';

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

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ valid: false, error: 'Database not configured' });
  }

  try {
    const { code, productKeys, subtotal } = req.body;

    if (!code || !productKeys || subtotal === undefined) {
      return res.status(400).json({ valid: false, error: 'Missing required fields' });
    }

    const normalizedCode = code.toUpperCase().trim();

    // Fetch discount code from database
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

    if (!discountCode) {
      return res.status(400).json({ valid: false, error: 'Invalid discount code' });
    }

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

    console.log(`[DISCOUNT] Code ${normalizedCode} validated: -$${(discountAmount / 100).toFixed(2)}`);

    return res.status(200).json({
      valid: true,
      code: discountCode.code,
      discount_type: discountCode.discountType,
      discount_value: discountCode.discountValue,
      discount_amount: discountAmount,
      final_total: subtotal - discountAmount,
    });
  } catch (error) {
    console.error('[DISCOUNT] Validation error:', error);
    return res.status(500).json({ valid: false, error: 'Failed to validate code' });
  }
}
