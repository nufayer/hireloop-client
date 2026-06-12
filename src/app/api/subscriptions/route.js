import { NextResponse } from 'next/server';
import { createSubscriptionInDb } from '@/lib/api/subscriptions';

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await createSubscriptionInDb(payload);

    return NextResponse.json({
      insertedId: result._id,
      subscription: result,
      success: true,
    });
  } catch (err) {
    console.error('Error in /api/subscriptions POST:', err);
    const status = err.message.includes('Invalid payload') ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Server error' }, { status });
  }
}
