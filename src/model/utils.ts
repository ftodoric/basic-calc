import { Key } from "./keyboard";

export function isNumber(value: string): boolean {
  return value === "" ? false : !isNaN(Number(value));
}

export function isDisplayFull(display: string): boolean {
  return display.replace(/[-.]/g, "").length === 10;
}

// Operation characteristic
const unaryOP = [
  Key.SQ,
  Key.SQRT,
  Key.INV,
  Key.SIN,
  Key.COS,
  Key.TAN,
  Key.SIGN,
];
const binaryOP = [Key.ADD, Key.SUB, Key.MUL, Key.DIV];

export function isOP(op: string) {
  return {
    unary: unaryOP.find((item) => {
      return item === op;
    }),
    binary: binaryOP.find((item) => {
      return item === op;
    }),
  };
}

function applyUnaryOP(value: number, op: string) {
  switch (op) {
    case Key.SQ:
      return value * value;
    case Key.SQRT:
      return Math.sqrt(value);
    case Key.INV:
      return 1 / value;
    case Key.SIN:
      return Math.sin(value);
    case Key.COS:
      return Math.cos(value);
    case Key.TAN:
      return Math.tan(value);
    case Key.SIGN:
      return -value;
    default:
      return NaN;
  }
}

function applyOP(value1: number, value2: number, op: string): number {
  switch (op) {
    case Key.ADD:
      return value1 + value2;
    case Key.SUB:
      return value1 - value2;
    case Key.MUL:
      return value1 * value2;
    case Key.DIV:
      return value1 / value2;
    default:
      return NaN;
  }
}

export function getIndexOfFirstUnaryOPFromRight(expr: string[]) {
  let targetIndex = [...expr]
    .reverse()
    .splice(1)
    .findIndex((item) => !isOP(item).unary);
  if (targetIndex === -1) return 0;
  else return expr.length - 1 - targetIndex;
}

export function solveInfix(expr: string[]): number {
  let modifiedExpr = [...expr];
  // Remove equality operator at the end
  if (modifiedExpr[modifiedExpr.length - 1] === Key.EQ) modifiedExpr.pop();

  // Solve multiplication and division
  while (modifiedExpr.includes(Key.MUL) || modifiedExpr.includes(Key.DIV)) {
    let target = modifiedExpr.findIndex(
      (item) => item === Key.MUL || item === Key.DIV
    );
    let result = applyOP(
      Number(modifiedExpr[target - 1]),
      Number(modifiedExpr[target + 1]),
      modifiedExpr[target]
    );
    modifiedExpr[target - 1] = result.toString();
    modifiedExpr.splice(target, 2);
  }

  // Solve addition and subtraction
  while (modifiedExpr.includes(Key.ADD) || modifiedExpr.includes(Key.SUB)) {
    let target: number = modifiedExpr.findIndex((item) => {
      return item === Key.ADD || item === Key.SUB;
    });
    let result = applyOP(
      Number(modifiedExpr[target - 1]),
      Number(modifiedExpr[target + 1]),
      modifiedExpr[target]
    );
    modifiedExpr[target - 1] = result.toString();
    modifiedExpr.splice(target, 2);
  }

  return Number(modifiedExpr[0]);
}

function formatByDisplayConstraints(value: number): string {
  // Display is constrained to 10 digits (without floating point and sign character)

  // If the whole part of the number exceeds display limit, display error
  if (value.toString().split(".")[0].replace("-", "").length > 10)
    return "Display Error";

  // Decimals can be removed
  // Remove rightmost digits from the number (sacrificing precision to fit the display)
  // When removing digits from right to left don't count floating point
  const valueChars = value.toString().split("");
  let removed = 0,
    i = 0;
  const toRemove =
    valueChars.filter((item) => {
      return isNumber(item);
    }).length - 10;
  while (removed < toRemove) {
    if (valueChars[i] !== ".") {
      valueChars.pop();
      removed++;
    }
    i++;
  }
  // If decimal is last character
  if (valueChars[valueChars.length - 1] === ".") valueChars.pop();

  return valueChars.join("");
}

export function evaluateExpression(expr: string[]): string {
  // Apply unary operator (or stack of them) on each item
  let unaryOPStack: string[] = [];
  let wasUnaryBefore = false;
  let places: number[][] = [];
  expr.forEach((item, i) => {
    if (isNumber(item) && wasUnaryBefore) {
      let result = Number(item);
      unaryOPStack.forEach((op) => {
        result = applyUnaryOP(result, op);
      });
      // Store evaluated
      places.push([i, result]);
      unaryOPStack = [];
      wasUnaryBefore = false;
    } else if (isOP(item).unary) {
      unaryOPStack.push(item);
      wasUnaryBefore = true;
    }
  });
  // Replace past values with evaluated
  let exprModified = [...expr];
  places.forEach((item) => {
    exprModified[item[0]] = item[1].toString();
  });
  // Remove all unary operators from the expression list
  exprModified = exprModified.filter((item) => {
    return !isOP(item).unary;
  });

  return formatByDisplayConstraints(solveInfix(exprModified));
}

export function evaluateLastUnaries(expr: string[]) {
  let firstOPIndex = getIndexOfFirstUnaryOPFromRight(expr);
  return evaluateExpression([...expr].splice(firstOPIndex));
}
