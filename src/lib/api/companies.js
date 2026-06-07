import { getUserSession } from '../core/session';

const getAbsoluteApiUrl = (path) => {
  if (typeof window !== 'undefined') {
    return path;
  }

  const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return new URL(path, baseUrl).toString();
};
export const getRecruiterCompany = async (recruiterId) => {
  if (!recruiterId) {
    return null;
  }

  const path = `/api/companies?recruiterId=${encodeURIComponent(recruiterId)}`;
  const url = getAbsoluteApiUrl(path);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch recruiter company: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data?.company ?? null;
  } catch (error) {
    console.error('Error fetching recruiter company:', error);
    throw error;
  }
};

// Convenience helper to get the company for the currently logged-in recruiter
export const getLoggedInRecruiterCompany = async () => {
  const user = await getUserSession();
  const recruiterId = user?.id || user?._id || null;
  if (!recruiterId) return null;

  return await getRecruiterCompany(recruiterId);
};
