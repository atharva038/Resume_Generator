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

    // Admin user details
    const adminEmail = "atharvasjoshi2005@gmail.com";
    const adminPassword = "Admin@123"; // Change this to a secure password
    const adminName = "Atharva Sachin Joshi";

    // Check if admin already exists
    const existingAdmin = await User.findOne({email: adminEmail});

    if (existingAdmin) {
      // Update existing user to admin and reset password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.status = "active";
      existingAdmin.name = adminName;
      existingAdmin.updatedAt = new Date();
      await existingAdmin.save();
      console.log("✅ Existing user updated to admin role");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   🔑 Password has been reset!");
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await admin.save();
      console.log("✅ New admin user created successfully");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   ⚠️  Please change this password after first login!");
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
