import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Works"
  });
  return;
});

app.listen(8080, () => console.log("Server is up on PORT 8080"))
