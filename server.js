import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { router as contactsRouter } from "./routes/api/contacts.js";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const uriDb = process.env.DB_HOST;
const connection = mongoose.connect(uriDb);

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

connection
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  });
