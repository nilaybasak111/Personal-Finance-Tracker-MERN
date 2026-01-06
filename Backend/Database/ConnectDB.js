import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL);
    //console.log(process.env.DATABASE_URL);
    // console.log(
    //   "Connection is Established",
    //   connect.connection.host,
    //   connect.connection.name
    // );
    console.log("DataBase Connected in ConnectDB.js");
  } catch (error) {
    console.log("DataBase Connection Failed in ConnectDB.js", error);
    process.exit(1);
  }
};

export default ConnectDB;
