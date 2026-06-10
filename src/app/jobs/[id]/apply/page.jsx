import React from 'react';
import Link from 'next/link';
import { getJobById } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';
import JobApply from './JobApply';
import { getApplicationsByApplicant } from '@/lib/api/application';

const ApplyPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);
  const user = await getUserSession();

  if(!user) {
    redirect(`/auth/signin?redirect=/jobs/${id}/apply`);
  }

  if(user.role !== 'seeker') {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
        <h1 className="text-3xl font-semibold">Access Denied</h1>
        <p className="text-zinc-400 mt-4">Only job seekers can apply for jobs. Please sign in with a seeker account to proceed.</p>
        <Link href="/jobs" className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-500">
          Back to Job Listings
        </Link>
      </div>
    );
  }



  if (!job) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
        <h1 className="text-3xl font-semibold">Job not found</h1>
        <p className="text-zinc-400 mt-4">We couldn&apos;t locate the job you are trying to apply for.</p>
        <Link href="/jobs" className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-500">
          Back to Job Listings
        </Link>
      </div>
    );
  }

  const applications = await getApplicationsByApplicant(user.id);
  const plan = {
    name: 'Free Plan',
    maxApplicationsPerMonth: 5
  }

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-white p-6 md:p-12 lg:p-16">
      <div className="max-w-4xl mx-auto rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <div className="space-y-4">
          <div>
            <h2>You Have applied {applications.length} times out of {plan.maxApplicationsPerMonth} this month.</h2>
            {applications.length < plan.maxApplicationsPerMonth && (
              <p className="text-green-500">You can still apply for more jobs this month.</p>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Apply for {job.jobTitle}</h1>
          <p className="text-zinc-400 text-base">
            You&apos;re applying to <span className="font-semibold text-white">{job.companyName}</span>.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-zinc-950 p-4 border border-zinc-800">
              <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Location</h2>
              <p className="mt-2 text-white">{job.location || 'Remote'}</p>
            </div>
            <div className="rounded-3xl bg-zinc-950 p-4 border border-zinc-800">
              <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Job Type</h2>
              <p className="mt-2 text-white">{job.jobType}</p>
            </div>
          </div>
          <div>
            <JobApply job={job} applicant={user} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href={`/jobs/${id}`} className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200">
            Back to Job Details
          </Link>
          <Link href="/jobs" className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
            Back to Browse Jobs
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ApplyPage;
