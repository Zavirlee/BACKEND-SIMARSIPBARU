const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Perbaikan 1
const databaseConfig = require("./database/config");
const routes = require("./routes"); // Perbaikan 2
require("dotenv").config();

databaseConfig.connect((err) => {
  if (err) {
    console.error(err); // Menggunakan console.error untuk kesalahan
    return;
  }
  console.log("Database Connected");
});

app.use(bodyParser.json({ limit: "3560mb" }));
app.use(bodyParser.urlencoded({ limit: "3560mb", extended: true }));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:9000",
    "http://10.35.41.113:3000",
    "http://10.35.41.113:9000"
  ],
};

app.use(cors(corsOptions));
app.use("/", routes);

app.get("/", async (req, res) => {
  try {
    res.send(`Welcome Page`);
  } catch (error) {
    console.error(error); // Perbaikan 3
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000; // Perbaikan 4
app.listen(PORT, () => {
  console.log(`Application is running on ${PORT}!! `);
});
