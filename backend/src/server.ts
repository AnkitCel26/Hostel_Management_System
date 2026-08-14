import "reflect-metadata";
import "dotenv/config";
import app from "./app.ts";
import { AppDataSource } from "./config/db.ts";

const PORT = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });
