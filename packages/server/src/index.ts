// src/index.ts
import express, { Request, Response } from "express";
import profiles from "./routes/profiles";
import { connect } from "./services/mongo";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
// Mongo Connection

app.use(cors())
connect("Gamin");


const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/profiles", profiles);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
