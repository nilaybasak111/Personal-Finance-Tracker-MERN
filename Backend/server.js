import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Adding Path for .env
import express from "express";

const app = express();
const PORT = process.env.PORT;

//Configuration of json Data for the API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initiateing Database Connection
import ConnectDB from "./Database/ConnectDB.js";
ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is Running in the Port ${PORT}`);
});
