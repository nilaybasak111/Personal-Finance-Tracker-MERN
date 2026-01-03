require("dotenv").config({ path: "../.env" }); // Adding Path for .env
const express = require("express");

const app = express();
const PORT = process.env.PORT;

//Configuration of json Data for the API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is Running in the Port ${PORT}`);
});
