import mongoose from "mongoose";
import "dotenv/config";

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Drop the userId index if it exists
    try {
      await usersCollection.dropIndex("userId_1");
      console.log("Dropped userId_1 index");
    } catch (error) {
      console.log("userId_1 index doesn't exist or already dropped");
    }

    // Create new sparse unique index on userId
    await usersCollection.createIndex({ userId: 1 }, { unique: true, sparse: true });
    console.log("Created new sparse unique index on userId");

    console.log("Database fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing database:", error);
    process.exit(1);
  }
}

fixDatabase();

