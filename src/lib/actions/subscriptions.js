'use server';
import { createSubscriptionInDb } from '@/lib/api/subscriptions';

export const createSubscription = async (subscriptionData) => {
  try {
    const result = await createSubscriptionInDb(subscriptionData);
    return result;
  } catch (err) {
    console.error('Action error in createSubscription:', err);
    throw new Error(`Create subscription failed: ${err.message}`);
  }
};
