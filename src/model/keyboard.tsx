import { BackSpaceIcon } from "../components/Icons/BackSpaceIcon";

export enum Key {
  // Display and memory functions
  AC = "All Clear",
  C = "Clear",
  MS = "Memory Store",
  MR = "Memory Retrieve",
  BCKSP = "Backspace",

  // Unary operators
  SQ = "Square",
  SQRT = "Square Root",
  INV = "Inverse",
  SIN = "Sine",
  COS = "Cosine",
  TAN = "Tangent",

  // Binary operators
  ADD = "Addition",
  SUB = "Subtraction",
  MUL = "Multiplication",
  DIV = "Division",

  // Evaluation operator
  EQ = "Equals",

  // Negate operator
  NEG = "Negation",

  // Floating point
  FP = "Floating Point",

  // Digits
  ZERO = "0",
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
}

export const layout = [
  [
    { key: Key.AC, content: "AC" },
    { key: Key.C, content: "C" },
    { key: Key.MS, content: "MS" },
    { key: Key.MR, content: "MR" },
  ],
  [
    { key: Key.SQ, content: "x\u00b2" },
    { key: Key.SQRT, content: "\u221ax" },
    { key: Key.INV, content: "1/x" },
    {
      key: Key.BCKSP,
      content: <BackSpaceIcon width="22" height="22" fill="#06354f" />,
    },
  ],
  [
    { key: Key.SIN, content: "sin" },
    { key: Key.COS, content: "cos" },
    { key: Key.TAN, content: "tan" },
    { key: Key.ADD, content: "+" },
  ],
  [
    { key: Key.ONE, content: "1" },
    { key: Key.TWO, content: "2" },
    { key: Key.THREE, content: "3" },
    { key: Key.SUB, content: "\u2212" },
  ],
  [
    { key: Key.FOUR, content: "4" },
    { key: Key.FIVE, content: "5" },
    { key: Key.SIX, content: "6" },
    { key: Key.MUL, content: "\u00d7" },
  ],
  [
    { key: Key.SEVEN, content: "7" },
    { key: Key.EIGHT, content: "8" },
    { key: Key.NINE, content: "9" },
    { key: Key.DIV, content: "\u00f7" },
  ],
  [
    { key: Key.NEG, content: "\u00b1" },
    { key: Key.ZERO, content: "0" },
    { key: Key.FP, content: "." },
    { key: Key.EQ, content: "=" },
  ],
];
