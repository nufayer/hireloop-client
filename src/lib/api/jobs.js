
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

const mockJobs = [
  {
    _id: 'job_1',
    companyId: 'company_1',
    companyName: 'HireLoop',
    companyLogo: '/images/company-logo-1.png',
    jobTitle: 'Senior Frontend Engineer',
    jobType: 'Full-time',
    jobCategory: 'Engineering',
    isRemote: false,
    location: 'New York, NY',
    status: 'Active',
    minSalary: '120000',
    maxSalary: '150000',
    requirements: '5+ years with React, TypeScript, and modern frontend tooling.',
    responsibilities: 'Build responsive web applications, mentor junior engineers, and collaborate with product teams.',
    benefits: 'Health insurance, remote-friendly schedule, equity, and professional development stipend.',
  },
  {
    _id: 'job_2',
    companyId: 'company_2',
    companyName: 'Nimbus Design',
    companyLogo: '/images/company-logo-2.png',
    jobTitle: 'Product Designer',
    jobType: 'Contract',
    jobCategory: 'Design',
    isRemote: true,
    location: 'Remote',
    status: 'Inactive',
    minSalary: '90000',
    maxSalary: '110000',
    requirements: 'Design systems, user research, and product discovery experience.',
    responsibilities: 'Create product experiences and collaborate with engineering and marketing teams.',
    benefits: 'Flexible hours, remote-first environment, and healthcare stipend.',
  },
  {
    _id: 'job_3',
    companyId: 'company_1',
    companyName: 'HireLoop',
    companyLogo: '/images/company-logo-1.png',
    jobTitle: 'Backend Engineer',
    jobType: 'Full-time',
    jobCategory: 'Engineering',
    isRemote: false,
    location: 'San Francisco, CA',
    status: 'Active',
    minSalary: '130000',
    maxSalary: '160000',
    requirements: 'Experience building REST and GraphQL APIs with Node.js and MongoDB.',
    responsibilities: 'Design scalable backend systems and improve application performance.',
    benefits: '401(k), equity, and annual learning budget.',
  },
];

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch jobs: ${res.status} ${text}`);
  }
  return res.json();
};

const filterMockJobs = ({ companyId, status, id }) => {
  return mockJobs.filter((job) => {
    if (companyId && job.companyId !== companyId) return false;
    if (status && status.toLowerCase() !== 'all' && job.status?.toLowerCase() !== status.toLowerCase()) return false;
    if (id && job._id !== id) return false;
    return true;
  });
};

const buildUrl = (path) => {
  // On the server, ensure we return an absolute URL using available env
  // fallbacks so `new URL(...)` never receives a bare relative path.
  if (typeof window === 'undefined') {
    const serverBase = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return new URL(path, serverBase).toString();
  }

  return baseUrl ? new URL(path, baseUrl).toString() : path;
};

export const getJobs = async (status = 'active') => {
  const url = buildUrl(`/api/jobs?status=${encodeURIComponent(status)}`);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    return handleResponse(res);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    if (!baseUrl) {
      return filterMockJobs({ status });
    }
    throw error;
  }
};

export const getJobById = async (id) => {
  if (!id) return null;
  const url = buildUrl(`/api/jobs?id=${encodeURIComponent(id)}`);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await handleResponse(res);

    // If the API returned null (not found), attempt a local fallback
    if (!data) {
      try {
        const all = await getJobs('all');
        if (Array.isArray(all)) {
          return all.find((j) => {
            const jid = j?._id?.$oid ?? j?._id?.toString?.() ?? j?._id;
            return jid === id;
          }) || null;
        }
      } catch (e) {
        // ignore and return null below
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching job by id:', error);
    if (!baseUrl) {
      return filterMockJobs({ id })[0] || null;
    }
    throw error;
  }
};

export const getCompanyJobs = async (companyId, status = 'active') => {
  const url = buildUrl(
    `/api/jobs?companyId=${encodeURIComponent(companyId)}&status=${encodeURIComponent(status)}`
  );

  try {
    const res = await fetch(url, { cache: 'no-store' });
    return handleResponse(res);
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    if (!baseUrl) {
      return filterMockJobs({ companyId, status });
    }
    throw error;
  }
};
