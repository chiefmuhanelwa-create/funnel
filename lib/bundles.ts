/**
 * SINGLE SOURCE OF TRUTH for product bundle configurations.
 *
 * When a user purchases a bundle product, they automatically get access
 * to all included products.
 *
 * Used by:
 * - api/webhooks/paystack.ts (granting access)
 * - api/checkout/verify.ts (showing granted products)
 * - src/react-app/context/MemberAccessContext.tsx (checking access)
 * - src/worker/emails/index.ts (email content)
 */

export const PRODUCT_BUNDLES: Record<string, string[]> = {
  // Starter Kit includes workbooks
  'starter-kit': ['niche-finder', 'paids-workbook'],

  // Pro bundle includes everything
  'contentpreneur-pro': [
    'starter-kit',
    'content-foundations',
    'influencers-code',
    'tax-guide',
    'niche-finder',
    'paids-workbook',
  ],
};

/**
 * Get all products that should be granted when purchasing a product.
 * Includes the product itself plus any bundled products.
 */
export function getProductsToGrant(purchasedProductKeys: string[]): string[] {
  const productsToGrant = new Set<string>();

  for (const productKey of purchasedProductKeys) {
    productsToGrant.add(productKey);

    const bundledProducts = PRODUCT_BUNDLES[productKey];
    if (bundledProducts) {
      bundledProducts.forEach(key => productsToGrant.add(key));
    }
  }

  return Array.from(productsToGrant);
}

/**
 * Check if a user has access to a product through a bundle.
 * Returns true if they own the product directly OR own a bundle that includes it.
 */
export function hasAccessThroughBundle(
  productKey: string,
  ownedProductKeys: string[]
): boolean {
  // Direct ownership
  if (ownedProductKeys.includes(productKey)) {
    return true;
  }

  // Check if any owned product bundles include this product
  for (const ownedKey of ownedProductKeys) {
    const bundledProducts = PRODUCT_BUNDLES[ownedKey];
    if (bundledProducts && bundledProducts.includes(productKey)) {
      return true;
    }
  }

  return false;
}

/**
 * Get the bundle that contains a product, if any.
 * Returns null if the product is not part of any bundle.
 */
export function getBundleContaining(productKey: string): string | null {
  for (const [bundleKey, bundledProducts] of Object.entries(PRODUCT_BUNDLES)) {
    if (bundledProducts.includes(productKey)) {
      return bundleKey;
    }
  }
  return null;
}
