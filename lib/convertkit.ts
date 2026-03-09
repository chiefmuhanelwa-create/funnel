/**
 * ConvertKit API Integration
 * Handles subscriber management, tagging, and email sequence enrollment
 */

const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

interface ConvertKitResponse {
  subscription?: {
    subscriber: {
      id: number;
      email_address: string;
    };
  };
  error?: string;
}

/**
 * Add subscriber to ConvertKit form and optionally tag them
 */
export async function addToConvertKit(
  email: string,
  firstName?: string,
  tagIds?: string[]
): Promise<{ success: boolean; subscriberId?: number; error?: string }> {
  const formId = process.env.CONVERTKIT_FORM_ID;
  const apiKey = process.env.CONVERTKIT_API_KEY;

  if (!formId || !apiKey) {
    console.log('[CONVERTKIT] Credentials not configured - skipping');
    return { success: false, error: 'ConvertKit not configured' };
  }

  try {
    // Subscribe to form
    const response = await fetch(`${CONVERTKIT_API_URL}/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        first_name: firstName || email.split('@')[0],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CONVERTKIT] Subscribe failed:', errorText);
      return { success: false, error: errorText };
    }

    const data: ConvertKitResponse = await response.json();
    const subscriberId = data.subscription?.subscriber?.id;

    console.log(`[CONVERTKIT] Subscribed: ${email} (ID: ${subscriberId})`);

    // Add tags if provided
    if (tagIds && tagIds.length > 0 && subscriberId) {
      for (const tagId of tagIds) {
        if (tagId) {
          await addTagToSubscriber(email, tagId);
        }
      }
    }

    return { success: true, subscriberId };
  } catch (error: any) {
    console.error('[CONVERTKIT] Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Add a tag to a subscriber by email
 */
export async function addTagToSubscriber(
  email: string,
  tagId: string
): Promise<boolean> {
  const apiKey = process.env.CONVERTKIT_API_KEY;

  if (!apiKey || !tagId) {
    return false;
  }

  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/tags/${tagId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    });

    if (response.ok) {
      console.log(`[CONVERTKIT] Tagged ${email} with tag ${tagId}`);
      return true;
    }

    console.error('[CONVERTKIT] Tag failed:', await response.text());
    return false;
  } catch (error: any) {
    console.error('[CONVERTKIT] Tag error:', error.message);
    return false;
  }
}

/**
 * Remove a tag from a subscriber
 */
export async function removeTagFromSubscriber(
  email: string,
  tagId: string
): Promise<boolean> {
  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiSecret || !tagId) {
    return false;
  }

  try {
    // First get subscriber ID
    const subscriberResponse = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_secret=${apiSecret}&email_address=${encodeURIComponent(email)}`
    );

    if (!subscriberResponse.ok) return false;

    const data = await subscriberResponse.json();
    const subscriberId = data.subscribers?.[0]?.id;

    if (!subscriberId) return false;

    const response = await fetch(
      `${CONVERTKIT_API_URL}/subscribers/${subscriberId}/tags/${tagId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_secret: apiSecret }),
      }
    );

    return response.ok;
  } catch (error: any) {
    console.error('[CONVERTKIT] Remove tag error:', error.message);
    return false;
  }
}

/**
 * Subscribe to an email sequence (automated series)
 */
export async function addToSequence(
  email: string,
  sequenceId: string
): Promise<boolean> {
  const apiKey = process.env.CONVERTKIT_API_KEY;

  if (!apiKey || !sequenceId) {
    console.log('[CONVERTKIT] Sequence not configured - skipping');
    return false;
  }

  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/sequences/${sequenceId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    });

    if (response.ok) {
      console.log(`[CONVERTKIT] Added ${email} to sequence ${sequenceId}`);
      return true;
    }

    console.error('[CONVERTKIT] Sequence subscribe failed:', await response.text());
    return false;
  } catch (error: any) {
    console.error('[CONVERTKIT] Sequence error:', error.message);
    return false;
  }
}

/**
 * Update subscriber custom fields
 */
export async function updateSubscriberFields(
  email: string,
  fields: Record<string, string>
): Promise<boolean> {
  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiSecret) {
    return false;
  }

  try {
    // First get subscriber ID
    const subscriberResponse = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_secret=${apiSecret}&email_address=${encodeURIComponent(email)}`
    );

    if (!subscriberResponse.ok) return false;

    const data = await subscriberResponse.json();
    const subscriberId = data.subscribers?.[0]?.id;

    if (!subscriberId) return false;

    const response = await fetch(`${CONVERTKIT_API_URL}/subscribers/${subscriberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: apiSecret,
        fields,
      }),
    });

    if (response.ok) {
      console.log(`[CONVERTKIT] Updated fields for ${email}`);
      return true;
    }

    return false;
  } catch (error: any) {
    console.error('[CONVERTKIT] Update fields error:', error.message);
    return false;
  }
}

/**
 * Complete ConvertKit integration after purchase
 * Call this from the Paystack webhook after successful payment
 */
export async function handlePurchaseConvertKit(
  email: string,
  customerName: string | null,
  productsGranted: string[],
  amountPaidCents: number
): Promise<void> {
  // Get environment tags
  const tagPurchased = process.env.CONVERTKIT_TAG_PURCHASED;
  const tagActive = process.env.CONVERTKIT_TAG_ACTIVE;
  const welcomeSequenceId = process.env.CONVERTKIT_SEQUENCE_WELCOME;

  // 1. Add to ConvertKit with purchase tags
  const tags = [tagPurchased, tagActive].filter(Boolean) as string[];

  await addToConvertKit(
    email,
    customerName || email.split('@')[0],
    tags
  );

  // 2. Subscribe to welcome sequence
  if (welcomeSequenceId) {
    await addToSequence(email, welcomeSequenceId);
  }

  // 3. Update custom fields with purchase info
  await updateSubscriberFields(email, {
    last_purchase_date: new Date().toISOString().split('T')[0],
    products_owned: productsGranted.join(', '),
    purchase_amount: `$${(amountPaidCents / 100).toFixed(2)}`,
    source: 'direct_purchase',
  });

  console.log(`[CONVERTKIT] Purchase integration complete for ${email}`);
}

/**
 * Tag user based on course progress milestones
 */
export async function handleProgressMilestone(
  email: string,
  milestone: 'first_lesson' | 'third_lesson' | 'all_complete'
): Promise<void> {
  const tagMapping: Record<string, string | undefined> = {
    first_lesson: process.env.CONVERTKIT_TAG_MODULE1_COMPLETE,
    third_lesson: process.env.CONVERTKIT_TAG_ENGAGED,
    all_complete: process.env.CONVERTKIT_TAG_ALL_COMPLETE,
  };

  const tagId = tagMapping[milestone];

  if (tagId) {
    await addTagToSubscriber(email, tagId);
    console.log(`[CONVERTKIT] Tagged ${email} with milestone: ${milestone}`);
  }
}
