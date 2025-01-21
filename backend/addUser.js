const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

const addUser = async () => {
  await connectDB();

  const nama = "Test User";
  const email = "testuser@example.com";
  const password = "password123";

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("Pengguna sudah terdaftar");
      return;
    }

    user = new User({
      nama,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log("User berhasil ditambahkan");
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    mongoose.connection.close();
  }
};

addUser();
