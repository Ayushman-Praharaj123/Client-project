import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    profilePic: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model("Admin", adminSchema);

async function resetAdmins() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🗑️  Deleting existing admins...");
    const deleteResult = await Admin.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} admin(s)`);

    console.log("\n👥 Creating new admins...");

    // Validate environment variables
    if (!process.env.ADMIN_PHONE_1 || !process.env.ADMIN_PASSWORD_1) {
      throw new Error("ADMIN_PHONE_1 and ADMIN_PASSWORD_1 must be set in .env file");
    }
    if (!process.env.ADMIN_PHONE_2 || !process.env.ADMIN_PASSWORD_2) {
      throw new Error("ADMIN_PHONE_2 and ADMIN_PASSWORD_2 must be set in .env file");
    }
    if (!process.env.SUPER_ADMIN_PHONE || !process.env.SUPER_ADMIN_PASSWORD) {
      throw new Error("SUPER_ADMIN_PHONE and SUPER_ADMIN_PASSWORD must be set in .env file");
    }

    const defaultAdmins = [
      {
        name: "John",
        phoneNumber: process.env.ADMIN_PHONE_1,
        password: process.env.ADMIN_PASSWORD_1,
        role: "admin",
      },
      {
        name: "Quinta",
        phoneNumber: process.env.ADMIN_PHONE_2,
        password: process.env.ADMIN_PASSWORD_2,
        role: "admin",
      },
      {
        name: "Steve",
        phoneNumber: process.env.SUPER_ADMIN_PHONE,
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: "superadmin",
      },
    ];

    await Admin.insertMany(defaultAdmins);
    console.log("✅ New admins created successfully!");

    console.log("\n" + "=".repeat(50));
    console.log("📋 ADMIN ACCOUNTS CREATED");
    console.log("=".repeat(50));
    console.log("\n✅ 3 admin accounts have been created");
    console.log("   - 2 Admins (John, Quinta)");
    console.log("   - 1 Super Admin (Steve)");
    console.log("\n⚠️  Credentials are stored securely in .env file");
    console.log("\n" + "=".repeat(50) + "\n");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    console.log("\n🎉 Admin reset complete! You can now login with the credentials above.\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting admins:", error);
    process.exit(1);
  }
}

resetAdmins();

