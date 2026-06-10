'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const getCreateJobUrl = () => {
  if (API_BASE_URL) {
    return new URL('/api/jobs', API_BASE_URL).toString();
  }
  return '/api/jobs';
};

export const createJob = async (newJobData) => {
  const url = getCreateJobUrl();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newJobData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create job failed: ${res.status} ${text}`);
  }

  return res.json();
}