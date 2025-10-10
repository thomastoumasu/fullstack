import { isNotNumber } from "./utils";

interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error("not enough command line arguments");
  if (args.length > 4) throw new Error("too many command line arguments");

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  }
  throw new Error("Provided values were not numbers!");
};

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText, a * b);
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(
    value1,
    value2,
    `Multiplied ${value1} and ${value2}, the result is: `
  );
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

// const a: number = Number(process.argv[2])
// const b: number = Number(process.argv[3])
// console.log('argv: ', process.argv)
