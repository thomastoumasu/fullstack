import express from "express";
import morgan from "morgan";
import { calculateBmi } from "./bmiCalculator";
import { calculator, Operation } from "./calculator";
import { calculateExercises } from "./exerciseCalculator";
import { isNotNumber } from "./utils";
const app = express();
app.use(express.json());

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms"
);

app.use(requestLogger);

// Ex. 9.4
app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

// Ex. 9.5
app.get("/bmi", (req, res) => {
  const weight: number = Number(req.query.weight);
  const height: number = Number(req.query.height);
  if (isNaN(weight) || isNaN(height)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);
  return res.send({ weight, height, bmi });
});

// Course
app.post("/calculate", (req, res) => {
  console.log(req.body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // or better: narrow to a more specific type, see later
  const { value1, value2, op } = req.body;

  // validate the data
  if (!value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // or assert the type
  try {
    const result = calculator(Number(value1), Number(value2), op as Operation);
    return res.send({ result });
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).json({ error: errorMessage });
  }
});

// Ex 9.6
app.post("/exercise", (req, res) => {
  const { daily_exercises, target } = req.body;

  // validate the data
  if (!target || !daily_exercises) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    daily_exercises.filter((h: number) => isNotNumber(h)).length !== 0
  ) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  try {
    const metrics = calculateExercises(daily_exercises, target);
    return res.send(metrics);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).json({ error: errorMessage });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
