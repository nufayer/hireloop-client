import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const getMongoUri = () => process.env.MONGO_DB_URI;
const getDbName = () => process.env.MONGO_DB_NAME || process.env.AUTH_DB_NAME || 'hireloop';

async function getClient() {
  const uri = getMongoUri();
  if (!uri) return null;

  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function findCompanyByRecruiterId(recruiterId) {
  const client = await getClient();
  if (!client) return null;

  try {
    const db = client.db(getDbName());
    const company = await db.collection('companies').findOne({ recruiterId });
    return company;
  } finally {
    await client.close();
  }
}

async function insertCompanyToDb(company) {
  const client = await getClient();
  if (!client) return null;

  try {
    const db = client.db(getDbName());
    const result = await db.collection('companies').insertOne(company);
    return result;
  } finally {
    await client.close();
  }
}

async function updateCompanyByRecruiterId(recruiterId, updatedRecord) {
  const client = await getClient();
  if (!client) return null;

  try {
    const db = client.db(getDbName());
    const result = await db.collection('companies').findOneAndUpdate(
      { recruiterId },
      { $set: updatedRecord },
      { returnDocument: 'after' }
    );
    return result.value;
  } finally {
    await client.close();
  }
}

export async function GET(req) {
  try {
    const recruiterId = req.nextUrl.searchParams.get('recruiterId');
    if (!recruiterId) {
      return NextResponse.json({ error: 'Missing recruiterId' }, { status: 400 });
    }

    const company = await findCompanyByRecruiterId(recruiterId);
    if (!company) {
      return NextResponse.json({ company: null });
    }

    return NextResponse.json({ company: { ...company, _id: company._id.toString() } });
  } catch (err) {
    console.error('Error in /api/companies GET', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();
    console.log('POST /api/companies - payload received:', { 
      hasName: !!payload?.name, 
      hasRecruiterId: !!payload?.recruiterId,
      recruiterId: payload?.recruiterId 
    });

    if (!payload || !payload.name || !payload.recruiterId) {
      return NextResponse.json({ error: 'Invalid payload - missing name or recruiterId' }, { status: 400 });
    }

    console.log('Checking for existing company with recruiterId:', payload.recruiterId);
    const existingCompany = await findCompanyByRecruiterId(payload.recruiterId);
    console.log('Existing company found:', !!existingCompany);

    if (existingCompany) {
      const updatedCompany = {
        ...existingCompany,
        ...payload,
        updatedAt: new Date(),
      };

      console.log('Updating existing company...');
      const updated = await updateCompanyByRecruiterId(payload.recruiterId, updatedCompany);
      if (updated) {
        console.log('Company updated successfully');
        return NextResponse.json({ 
          company: { ...updated, _id: updated._id.toString() }, 
          updatedId: updated._id.toString(),
          success: true 
        });
      }
      
      throw new Error('Failed to update existing company');
    }

    const company = {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Inserting new company...');
    const dbResult = await insertCompanyToDb(company);
    if (dbResult && dbResult.insertedId) {
      console.log('Company inserted successfully with ID:', dbResult.insertedId);
      return NextResponse.json({ 
        insertedId: dbResult.insertedId.toString(), 
        company: { ...company, _id: dbResult.insertedId.toString() },
        success: true 
      });
    }

    console.log('No DB result, returning mock response');
    return NextResponse.json({ 
      insertedId: `company_${Date.now()}`, 
      company,
      success: true 
    });
  } catch (err) {
    console.error('Error in /api/companies POST:', err.message, err.stack);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
