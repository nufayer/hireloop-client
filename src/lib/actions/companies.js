'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createCompany = async (newCompanyData) => {
  const url = API_BASE_URL ? new URL('/api/companies', API_BASE_URL).toString() : '/api/companies';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCompanyData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create company failed: ${res.status} ${text}`);
  }

  return res.json();
};
