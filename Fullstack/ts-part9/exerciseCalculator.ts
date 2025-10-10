import { isNotNumber } from "./utils";

interface ExerciseData {
  target: number;
  hoursPerDay: number[];
}

interface Metrics {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (hoursPerDay: number[], target: number): Metrics => {
  const periodLength = hoursPerDay.length;
  const trainingDays = hoursPerDay.filter((h) => h !== 0).length;
  const totalHours = hoursPerDay.reduce((partialSum, h) => h + partialSum, 0);
  const average = totalHours / periodLength;
  const success = average >= target;
  const fractionOfTarget = average / target;
  let rating = 3;
  let ratingDescription = "well done :)";
  if (fractionOfTarget < 0.5) {
    rating = 1;
    ratingDescription = "could do better...";
  } else if (fractionOfTarget < 1) {
    rating = 2;
    ratingDescription = "almost there!";
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (args: string[]): ExerciseData => {
  if (args.length < 4) throw new Error("Not enough command line arguments");

  if (Number(args[2]) <= 0 || isNotNumber(args[2]))
    throw new Error("Target is not strictly positive");

  const target = Number(args[2]);

  const hoursPerDay = args.slice(3).map((h) => Number(h));

  if (hoursPerDay.filter((h) => isNotNumber(h)).length !== 0)
    throw new Error("Provided hours of exercise per day were not numbers!");

  return { target, hoursPerDay };
};

if (require.main === module) {
  try {
    // console.log("argv: ", process.argv);
    const { target, hoursPerDay } = parseArguments(process.argv);
    // console.log("target, hoursPerDay: ", target, hoursPerDay);
    console.log(calculateExercises(hoursPerDay, target));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}

// console.log(calculateExercises([0, 0, 2, 0, 0, 0, 2], 2))
