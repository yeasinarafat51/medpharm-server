const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  maxPoolSize: 10,
  minPoolSize: 0,

  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,

  maxIdleTimeMS: 60000,
});

let connectionPromise = null;

async function connectDB() {
  if (!connectionPromise) {
    connectionPromise = client
      .connect()
      .then(async () => {
        await client.db("admin").command({ ping: 1 });

        console.log("✅ MongoDB Connected");

        return client;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error("❌ MongoDB Error:", error.message);

        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
module.exports.client = client;
