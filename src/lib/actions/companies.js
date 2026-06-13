'use server';

import { revalidatePath } from 'next/cache';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_BASE_URL || '';
    }
    return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const createCompany = async (newCompanyData) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/companies`;
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

export const updateCompany = async (id, updatedFields) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/companies`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updatedFields }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update company failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  revalidatePath('/dashboard/admin/companies');
  return data;
};
