import { NextResponse } from 'next/server';
import { seekerPlans, recruiterPlans } from '@/lib/api/plans';

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const planId = searchParams.get('plan_id');

    const allPlans = [...seekerPlans, ...recruiterPlans];

    if (planId) {
      const plan = allPlans.find(p => p.id === planId);
      if (plan) {
        return NextResponse.json(plan);
      }
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(allPlans);
  } catch (err) {
    console.error('Error in /api/plans GET', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
