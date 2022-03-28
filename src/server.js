// Main point of the application
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import ejs from "ejs";
import helmet from "helmet";
import logger from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/router.js";

// The main function of the application.
const main = async () => {
  const app = express();
  const directoryFullName = dirname(fileURLToPath(import.meta.url));

  // Set up a morgan logger using the dev format for log entries.
  app.use(helmet());
  app.use(logger("dev"));
  // View engine setup.
  app.set("view engine", "ejs");
  app.set("views", join(directoryFullName, "views"));
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  // Serve static files.
  if (process.env.NODE_ENV === "production") {
    // Serve static files.
    app.use(express.static(join(directoryFullName, "public")));

    /**app.get('/', (req, res) => {
      res.sendFile(join(directoryFullName + './public/index.html'))
    })
    */
  }

  app.use(
    cors({
      origin: ["http://localhost:4200"],
      methods: ["GET", "PUT", "POST", "DELETE"],
    })
  );

  app.use(
    cookieSession({
      name: "sess", //name of the cookie in the browser
      secret: process.env.SECRET,
      httpOnly: true,
    })
  );

  // Register routes.
  app.use("/", router);

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500;

    if (req.app.get("env") !== "development") {
      res.status(err.status).json({
        status: err.status,
        message: err.message,
      });
      return;
    }

    // Development only!
    // Only providing detailed error in development.
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      innerException: err.innerException,
      stack: err.stack,
    });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
    console.log("Press Ctrl-C to terminate...");
  });
};

main().catch(console.error);
