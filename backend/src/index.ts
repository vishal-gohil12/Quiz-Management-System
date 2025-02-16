import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userRoute } from "./route/userRoute";
import { quizRoute } from "./route/quizRoute";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

export const prisma = new PrismaClient();
app.use(express.json());
app.use(cors({
  origin: "*"
}));

app.use('/user', userRoute);
app.use('/', quizRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
