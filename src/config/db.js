const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI is missing");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  maxPoolSize: 10,
  minPoolSize: 0,

  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,

  socketTimeoutMS: 45000,
});

let dbPromise = null;

const connectDB = async () => {
  if (!dbPromise) {
    dbPromise = client
      .connect()
      .then(async () => {
        await client.db("admin").command({ ping: 1 });

        console.log("✅ MongoDB Connected");

        return client;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);

        dbPromise = null;

        throw error;
      });
  }

  return dbPromise;
};

const database = client.db("medpharmDB");

module.exports = {
  client,
  database,
  connectDB,
};
