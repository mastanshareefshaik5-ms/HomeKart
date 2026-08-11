import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const adminEmail = "admin@homekart.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      existingAdmin.role = "admin";

      existingAdmin.password =
        await bcrypt.hash(adminPassword, 10);

      await existingAdmin.save();

      console.log("Existing user converted to ADMIN");
    } else {
      const hashedPassword =
        await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "HOMEKART Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("ADMIN account created successfully");
    }

    console.log("--------------------------------");
    console.log("ADMIN EMAIL: admin@homekart.com");
    console.log("ADMIN PASSWORD: admin123");
    console.log("--------------------------------");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {
    console.error("ADMIN CREATION ERROR:", error);

    process.exit(1);
  }
};

createAdmin();