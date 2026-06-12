import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_pro': 'price_1ThAAGA8bg40YTxulWD4zzrk',
    'seeker_free': 'price_1ThXkNA8bg40YTxunqoixi7y',
    'seeker_premium': 'price_1ThXlbA8bg40YTxuYseSX2nR',
    'recruiter_free': 'price_1ThXutA8bg40YTxu9wgX1vPS',
    'recruiter_growth': 'price_1ThXvZA8bg40YTxuYeTRLXx8',
    'recruiter_enterprise': 'price_1ThXwrA8bg40YTxuZgoQjk4m'
}   