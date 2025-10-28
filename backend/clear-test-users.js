import mongoose from "mongoose";
import "dotenv/config";

async function clearTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Delete all users (for testing only)
    const result = await usersCollection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    console.log("Test users cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing test users:", error);
    process.exit(1);
  }
}

clearTestUsers();

