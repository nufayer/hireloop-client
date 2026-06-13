import { serverFetch } from '../core/server';

export const getApplicationsByApplicant = async (applicantId) => {
    try {
        const res = await serverFetch(`/api/applications?applicantId=${applicantId}`);
        if (res.error) return [];
        return Array.isArray(res) ? res : [];
    } catch (e) {
        console.error("Error fetching applications", e);
        return [];
    }
}