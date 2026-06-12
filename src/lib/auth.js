import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
await client.connect();

const dbName = process.env.AUTH_DB_NAME || process.env.MONGO_DB_NAME || "hireloop";
const db = client.db(dbName);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db, {
        client,
    }),
    user: {
        additionalFields: {
            role: {
                default: "seeker"  
            },
            plan: {
                default: "seeker_free"
            }
        },
    },    

});