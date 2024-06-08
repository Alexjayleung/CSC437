import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import path from "path";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";

// Mongo Connection
connect("gamin");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Middleware:
app.use(express.static(staticDir));
app.use(express.json());
app.use("/auth", auth);

// NPM Packages
const nodeModules = path.resolve(
  __dirname,
  "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));


// API Routes:
app.use("/api/profiles", authenticateUser, profiles);

// HTML Routes:
app.get("/hello", (_: Request, res: Response) => {
  res.send(
    `<h1>Hello!</h1>
     <p>Server is up and running.</p>
     <p>Serving static files from <code>${staticDir}</code>.</p>
    `
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});