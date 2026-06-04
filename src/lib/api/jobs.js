
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export const getCompanyJobs = async (companyId, status = 'active') => {
    if (!baseUrl) {
        console.warn('NEXT_PUBLIC_BASE_URL is not configured');
        // Return stub data during development if API is not configured
        return [
            {
                _id: 'job_1',
                jobTitle: 'Senior Frontend Engineer',
                jobType: 'Full-time',
                jobCategory: 'Engineering',
                isRemote: false,
                location: 'New York, NY',
                status: 'Active',
            },
            {
                _id: 'job_2',
                jobTitle: 'Product Designer',
                jobType: 'Contract',
                jobCategory: 'Design',
                isRemote: true,
                location: '',
                status: 'Inactive',
            },
            {
                _id: 'job_3',
                jobTitle: 'Backend Engineer',
                jobType: 'Full-time',
                jobCategory: 'Engineering',
                isRemote: false,
                location: 'San Francisco, CA',
                status: 'Active',
            },
        ];
    }

    try {
        const url = new URL(`/api/jobs?companyId=${companyId}&status=${status}`, baseUrl).toString();
        const res = await fetch(url);
        
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch jobs: ${res.status} ${text}`);
        }
        
        return res.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
}
