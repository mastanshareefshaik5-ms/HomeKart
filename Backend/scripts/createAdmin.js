import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // CONNECT TO MONGODB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // ADMIN DETAILS
    const name = "HOMEKART Admin";
    const email = "admin@homekart.com";
    const password = "Admin@123";

    // CHECK EXISTING ADMIN
    const existingAdmin = await User.findOne({
      email
    });

    if (existingAdmin) {
      console.log("Admin account already exists");

      console.log({
        email: existingAdmin.email,
        role: existingAdmin.role
      });

      await mongoose.connection.close();

      return;
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // CREATE ADMIN
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: "",
      role: "admin",
      isActive: true
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("================================");

    await mongoose.connection.close();

  } catch (error) {
    console.error(
      "CREATE ADMIN ERROR:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();