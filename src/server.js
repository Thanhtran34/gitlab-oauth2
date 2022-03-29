// Main point of the application
import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import session from 'express-session'
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/router.js";

// The main function of the application.
const main = async () => {
  const app = express();
  const directoryFullName = dirname(fileURLToPath(import.meta.url));

  // Set up a morgan logger using the dev format for log entries.
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'https://gitlab.lnu.se'],
        'img-src': ["'self'", 'https://gitlab.lnu.se', '*.gravatar.com', 'cdn.jsdelivr.net']
      }
    })
  );
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.static(join(directoryFullName, "public")));

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  if (process.env.NODE_ENV === 'production') {
    // Serve static files.
    app.use(express.static(join(directoryFullName, 'public')))

    app.get('/', (req, res) => {
      res.sendFile(join(directoryFullName + '/public'))
    })
  }

  // View engine setup.
  app.set("view engine", "ejs");
  app.set("views", join(directoryFullName, "views"));

  // Setup and use session middleware (https://github.com/expressjs/session)
  const sessionOptions = {
    name: process.env.SESSION_NAME, // Don't use default session cookie name.
    secret: process.env.SESSION_SECRET, // Change it!!! The secret is used to hash the session with HMAC.
    resave: false, // Resave even if a request is not changing the session.
    saveUninitialized: false, // Don't save a created but not modified session.
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax' // allowed when following a regular link from an external website, blocking it in CSRF-prone request methods (POST)
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }

  app.use(session(sessionOptions))

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
    console.log(`App is running at ${process.env.PORT}`);
    console.log("Press Ctrl-C to terminate...");
  });
};

main().catch(console.error);
