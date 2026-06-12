import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { PLAN_PRICE_ID } from '@/lib/stripe'


export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const formData = await req.formData()
    const planId = String(formData.get('plan_id') || '')
    const priceId = PLAN_PRICE_ID[planId];

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        planId,
      },
      success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
