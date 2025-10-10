import { isNotNumber } from "./utils";

export interface HeightWeight {
  height: number;
  weight: number;
}

type Bmi = "Underweight" | "Normal range" | "Overweight" | "Obese";

export const calculateBmi = (height: number, weight: number): Bmi => {
  const bmi = (weight / (height * height)) * 10000;
  // console.log("bmi: ", bmi);
  switch (true) {
    case bmi <= 18.5:
      return "Underweight";
    case bmi <= 24.9:
      return "Normal range";
    case bmi <= 29.9:
      return "Overweight";
    default:
      return "Obese";
  }
};

const parseArguments = (args: string[]): HeightWeight => {
  if (args.length < 4) throw new Error("Not enough command line arguments");
  if (args.length > 4) throw new Error("Too many command line arguments");

  if (Number(args[2]) <= 0) throw new Error("Height is not strictly positive");

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  }
  throw new Error("Provided values were not numbers!");
};

if (require.main === module) {
  try {
    // console.log('argv: ', process.argv)
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
