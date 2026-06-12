import { MongoClient } from 'mongodb';

const getMongoUri = () => process.env.MONGO_DB_URI;
const getDbName = () => process.env.MONGO_DB_NAME || process.env.AUTH_DB_NAME || 'hireloop';

const getClient = async () => {
  const uri = getMongoUri();
  if (!uri) return null;
  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

const formatSubscription = (subscription) => {
  if (!subscription) return subscription;
  return {
    ...subscription,
    _id: subscription._id?.toString ? subscription._id.toString() : subscription._id,
  };
};

export async function createSubscriptionInDb(payload) {
  if (!payload || !payload.email || !payload.planId) {
    throw new Error('Invalid payload - missing email or planId');
  }

  const client = await getClient();
  if (!client) {
    throw new Error('Database connection not configured');
  }

  try {
    const db = client.db(getDbName());
    const subscription = {
      ...payload,
      status: payload.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('subscriptions').insertOne(subscription);
    
    if (!result?.insertedId) {
      throw new Error('Failed to create subscription in database');
    }

    return formatSubscription({ ...subscription, _id: result.insertedId });
  } finally {
    await client.close();
  }
}
