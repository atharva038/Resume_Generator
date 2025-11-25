import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model("User", userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Admin users to create/update
    const adminUsers = [
      {
        email: "atharvasjoshi2005@gmail.com",
        password: "Admin@123",
        name: "Atharva Sachin Joshi",
      },
      {
        email: "nandkishorjadhav9580@gmail.com",
        password: "Admin@123",
        name: "Nandkishor Jadhav",
      },
    ];

    // Process each admin user
    for (const adminData of adminUsers) {
      console.log(`\n🔄 Processing ${adminData.email}...`);

      // Check if admin already exists
      const existingAdmin = await User.findOne({email: adminData.email});

      if (existingAdmin) {
        // Update existing user to admin and reset password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        existingAdmin.password = hashedPassword;
        existingAdmin.role = "admin";
        existingAdmin.status = "active";
        existingAdmin.name = adminData.name;
        existingAdmin.updatedAt = new Date();
        await existingAdmin.save();
        console.log("✅ Existing user updated to admin role");
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log("   🔑 Password has been reset!");
      } else {
        // Create new admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        const admin = new User({
          email: adminData.email,
          password: hashedPassword,
          name: adminData.name,
          role: "admin",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await admin.save();
        console.log("✅ New admin user created successfully");
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log("   ⚠️  Please change this password after first login!");
      }
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createAdminUser();
