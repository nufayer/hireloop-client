import { serverFetch } from "../core/server";

export const seekerPlans = [
    {
        name: 'Free',
        id: 'seeker_free',
        price: '$0',
        period: '/forever',
        description: 'Essential features for getting started and organizing your initial search tracking.',
        maxApplicationsPerMonth: 3,
        features: [
            'Browse & save up to 10 jobs',
            'Apply to up to 3 jobs per month',
            'Basic profile page',
            'Standard email alerts'
        ],
    },
    {
        name: 'Pro',
        id: 'seeker_pro',
        price: '$19',
        period: '/month',
        description: 'Our most popular option for serious active candidates looking to rapidly accelerate landing a role.',
        maxApplicationsPerMonth: 30,
        features: [
            'Apply to up to 30 jobs per month',
            'Unlimited saved jobs',
            'Advanced application tracking dashboard',
            'Comprehensive salary insights'
        ],
    },
    {
        name: 'Premium',
        id: 'seeker_premium',
        price: '$39',
        period: '/month',
        description: 'Uncapped potential and priority visibility tools tailored for elite competitive talent placement.',
        maxApplicationsPerMonth: 1000, // Unlimited
        features: [
            'Everything in Pro + Unlimited applications',
            'Profile boost directly to recruiter feeds',
            'Early access to freshly published jobs',
            '24/7 Priority customer support queue'
        ],
    }
];

export const recruiterPlans = [
    {
        name: 'Free',
        id: 'recruiter_free',
        price: '$0',
        period: '/forever',
        description: 'Ideal baseline solution matching startups launching their initial hiring infrastructure pipeline.',
        maxActiveJobs: 3,
        features: [
            'Up to 3 active job posts simultaneously',
            'Basic applicant management pipeline',
            'Standard organic listing search visibility',
            'Great for a company’s first year of hiring'
        ],
    },
    {
        name: 'Growth',
        id: 'recruiter_growth',
        price: '$49',
        period: '/month',
        description: 'Expanded allocation built for expanding companies with active multi-departmental team tracks.',
        maxActiveJobs: 10,
        features: [
            'Up to 10 active job posts simultaneously',
            'Full automated applicant tracking workflow',
            'Basic listing performance metrics & analytics',
            'Dedicated email support desk response'
        ],
    },
    {
        name: 'Enterprise',
        id: 'recruiter_enterprise',
        price: '$149',
        period: '/month',
        description: 'High performance structural operations for organizations with continuous large-scale talent acquisition.',
        maxActiveJobs: 50,
        features: [
            'Up to 50 active job posts simultaneously',
            'Advanced interactive analytics visual dashboard',
            'Premium featured job listing styling boosts',
            'Multi-user team collaboration seats',
            'Custom corporate branding options',
            'Dedicated account manager + priority support'
        ],
    }
];

export const getPlanById = async (planId) => {
    // Try local lookup first for efficiency
    const allPlans = [...seekerPlans, ...recruiterPlans];
    const localPlan = allPlans.find(p => p.id === planId);
    if (localPlan) return localPlan;

    // Fallback to API if not found (though local should have them all)
    try {
        const res = await serverFetch(`/api/plans?plan_id=${planId}`);
        if (res && !res.error) return res;
    } catch (e) {
        console.error("Error fetching plan from API", e);
    }
    
    // Ultimate fallback to seeker_free
    return seekerPlans[0];
};
