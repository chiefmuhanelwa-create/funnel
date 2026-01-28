import type { Env } from '../types';

const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

interface ConvertKitSyncData {
  email: string;
  firstName: string;
  tags: string[];
  customFields?: Record<string, string>;
}

export async function syncToConvertKit(env: Env, data: ConvertKitSyncData): Promise<boolean> {
  if (!env.CONVERTKIT_API_KEY || !env.CONVERTKIT_API_SECRET) {
    console.log('ConvertKit not configured, skipping sync');
    return true;
  }

  try {
    // Create or update subscriber
    const subscriberResponse = await fetch(`${CONVERTKIT_API_URL}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: env.CONVERTKIT_API_SECRET,
        email: data.email,
        first_name: data.firstName,
        fields: data.customFields || {},
      }),
    });

    if (!subscriberResponse.ok) {
      console.error('ConvertKit subscriber sync failed:', await subscriberResponse.text());
      return false;
    }

    const subscriberData = await subscriberResponse.json() as {
      subscriber: { id: number };
    };

    // Add tags
    for (const tag of data.tags) {
      await addTag(env, subscriberData.subscriber.id, tag);
    }

    return true;
  } catch (error) {
    console.error('ConvertKit sync error:', error);
    return false;
  }
}

async function addTag(env: Env, subscriberId: number, tagName: string): Promise<boolean> {
  try {
    // First, find or create the tag
    const tagsResponse = await fetch(
      `${CONVERTKIT_API_URL}/tags?api_key=${env.CONVERTKIT_API_KEY}`
    );

    if (!tagsResponse.ok) {
      console.error('Failed to fetch ConvertKit tags');
      return false;
    }

    const tagsData = await tagsResponse.json() as {
      tags: Array<{ id: number; name: string }>;
    };

    let tagId = tagsData.tags.find(t => t.name.toLowerCase() === tagName.toLowerCase())?.id;

    // Create tag if it doesn't exist
    if (!tagId) {
      const createTagResponse = await fetch(`${CONVERTKIT_API_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: env.CONVERTKIT_API_SECRET,
          tag: { name: tagName },
        }),
      });

      if (createTagResponse.ok) {
        const newTag = await createTagResponse.json() as { id: number };
        tagId = newTag.id;
      }
    }

    if (!tagId) {
      console.error('Could not find or create tag:', tagName);
      return false;
    }

    // Tag the subscriber
    const tagSubscriberResponse = await fetch(
      `${CONVERTKIT_API_URL}/tags/${tagId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: env.CONVERTKIT_API_SECRET,
          email: '', // Will be looked up by subscriber ID
        }),
      }
    );

    return tagSubscriberResponse.ok;
  } catch (error) {
    console.error('ConvertKit tag error:', error);
    return false;
  }
}

export async function getSubscriber(env: Env, email: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_secret=${env.CONVERTKIT_API_SECRET}&email_address=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as {
      subscribers: Array<any>;
    };

    return data.subscribers[0] || null;
  } catch (error) {
    console.error('ConvertKit get subscriber error:', error);
    return null;
  }
}
