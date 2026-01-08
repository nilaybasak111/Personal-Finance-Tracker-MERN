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

// Importing Routes
import authRoutes from "./Routes/authRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import aiRouters from "./Routes/aiRoutes.js";

// Defining Routes
app.use("/api/auth", authRoutes); // Auth Routes
app.use("/api/transactions", transactionRoutes); // Transaction Routes
app.use("/api/ai", aiRouters); // AI Routes for Expense or Income Parsing

app.listen(PORT, () => {
  console.log(`Server is Running in the Port ${PORT}`);
});
