const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const axios = require("axios");
const cheerio = require("cheerio");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// bodyparser to limit size

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// koel bay & bikini beach webscraped routes

app.use("/api/spots", require("./routes/dataSourceRoute"));

// journals routes

app.use("/api/journals", require("./routes/journalRoutes"));

// users routes

app.use("/api/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`));
