import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

async function insertJobToDb(job) {
  const uri = process.env.MONGO_DB_URI;
  if (!uri) return null;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = process.env.MONGO_DB_NAME || process.env.AUTH_DB_NAME || 'hireloop';
    const db = client.db(dbName);
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

    // Add server-side defaults
    const job = {
      ...payload,
      createdAt: new Date(),
    };

    const dbResult = await insertJobToDb(job);
    if (dbResult && dbResult.insertedId) {
      return NextResponse.json({ insertedId: dbResult.insertedId.toString() });
    }

    // Fallback: return a mock inserted id when DB is not configured
    return NextResponse.json({ insertedId: `job_${Date.now()}` });
  } catch (err) {
    console.error('Error in /api/jobs POST', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
