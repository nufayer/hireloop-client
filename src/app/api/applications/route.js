import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const getMongoUri = () => process.env.MONGO_DB_URI;
const getDbName = () => process.env.MONGO_DB_NAME || process.env.AUTH_DB_NAME || 'hireloop';

async function getClient() {
  const uri = getMongoUri();
  if (!uri) return null;

  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const applicantId = searchParams.get('applicantId');
    const jobId = searchParams.get('jobId');

    const client = await getClient();
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = client.db(getDbName());
    const query = {};

    if (applicantId) query.applicantId = applicantId;
    if (jobId) query.jobId = jobId;

    const applications = await db.collection('applications').find(query).toArray();
    await client.close();

    const formattedApplications = applications.map(app => ({
      ...app,
      _id: app._id.toString(),
    }));

    return NextResponse.json(formattedApplications);
  } catch (err) {
    console.error('Error in /api/applications GET', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();

    if (!payload || !payload.jobId || !payload.applicantId) {
      return NextResponse.json({ error: 'Missing jobId or applicantId' }, { status: 400 });
    }

    const application = {
      ...payload,
      createdAt: new Date(),
      status: 'pending',
    };

    const client = await getClient();
    if (!client) {
        // Fallback for development if no DB
        return NextResponse.json({ 
            insertedId: `app_${Date.now()}`,
            success: true 
        });
    }

    const db = client.db(getDbName());
    const result = await db.collection('applications').insertOne(application);
    await client.close();

    if (result && result.insertedId) {
      return NextResponse.json({ 
        insertedId: result.insertedId.toString(),
        success: true 
      });
    }

    return NextResponse.json({ error: 'Failed to insert application' }, { status: 500 });
  } catch (err) {
    console.error('Error in /api/applications POST', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
