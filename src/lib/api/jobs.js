export async function getCompanyJobs(companyId) {
  // Temporary stub implementation: replace with real DB/API call.
  // Return sample data matching the fields used by the UI.
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
