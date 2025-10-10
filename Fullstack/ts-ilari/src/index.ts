import express from "express";
import diaryRouter from "./routes/diaries";
const app = express();
app.use(express.json());

const PORT = 3003;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diary", diaryRouter);

app.listen(PORT, () => {
  console.log(`server listens on port ${PORT}`);
});
