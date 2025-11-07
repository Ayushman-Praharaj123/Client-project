import Admin from "../models/Admin.js";

export async function seedDefaultAdmins() {
  try {
    // Check if admins already exist
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      console.log("✅ Admins already seeded");
      return;
    }

    // Validate environment variables
    if (!process.env.ADMIN_PHONE_1 || !process.env.ADMIN_PASSWORD_1) {
      console.error("❌ ADMIN_PHONE_1 and ADMIN_PASSWORD_1 must be set in .env file");
      return;
    }
    if (!process.env.ADMIN_PHONE_2 || !process.env.ADMIN_PASSWORD_2) {
      console.error("❌ ADMIN_PHONE_2 and ADMIN_PASSWORD_2 must be set in .env file");
      return;
    }
    if (!process.env.SUPER_ADMIN_PHONE || !process.env.SUPER_ADMIN_PASSWORD) {
      console.error("❌ SUPER_ADMIN_PHONE and SUPER_ADMIN_PASSWORD must be set in .env file");
      return;
    }

    // Create default admins from environment variables
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
    console.log("✅ Default admins seeded successfully (3 accounts created)");
  } catch (error) {
    console.error("❌ Error seeding admins:", error.message);
  }
}

