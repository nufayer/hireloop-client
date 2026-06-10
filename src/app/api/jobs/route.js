import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const getMongoUri = () => process.env.MONGO_DB_URI;
const getDbName = () => process.env.MONGO_DB_NAME || process.env.AUTH_DB_NAME || 'hireloop';

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

const getClient = async () => {
  const uri = getMongoUri();
  if (!uri) return null;

  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

const formatJob = (job) => {
  if (!job) return job;
  return {
    ...job,
    _id: job._id?.toString ? job._id.toString() : job._id,
  };
};

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id') || searchParams.get('jobId');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    const filterMockJobs = mockJobs.filter((job) => {
      if (id && job._id !== id) return false;
      if (companyId && job.companyId !== companyId) return false;
      if (status && status.toLowerCase() !== 'all' && job.status?.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });

    const client = await getClient();
    if (!client) {
      if (id) {
        return NextResponse.json(filterMockJobs[0] || null);
      }
      return NextResponse.json(filterMockJobs);
    }

    const db = client.db(getDbName());
    const query = {};

    if (id) {
      if (ObjectId.isValid(id)) {
        query.$or = [{ _id: new ObjectId(id) }, { _id: id }];
      } else {
        query._id = id;
      }
    }
    if (companyId) {
      query.companyId = companyId;
    }
    if (status && status.toLowerCase() !== 'all') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    const collection = db.collection('jobs');
    if (id) {
      const job = await collection.findOne(query);
      await client.close();
      return NextResponse.json(formatJob(job) || null);
    }

    const jobs = await collection.find(query).toArray();
    await client.close();
    return NextResponse.json(jobs.map(formatJob));
  } catch (err) {
    console.error('Error in /api/jobs GET', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

async function insertJobToDb(job) {
  const uri = process.env.MONGO_DB_URI;
  if (!uri) return null;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(getDbName());
    const result = await db.collection('jobs').insertOne(job);
    return result;
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();
    if (!payload || !payload.jobTitle) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const job = {
      ...payload,
      createdAt: new Date(),
    };

    const dbResult = await insertJobToDb(job);
    if (dbResult && dbResult.insertedId) {
      return NextResponse.json({ insertedId: dbResult.insertedId.toString() });
    }

    return NextResponse.json({ insertedId: `job_${Date.now()}` });
  } catch (err) {
    console.error('Error in /api/jobs POST', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
