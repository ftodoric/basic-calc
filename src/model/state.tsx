import { Key } from "./keyboard";
import {
  isDisplayFull,
  isOP,
  isNumber,
  evaluateExpression,
  getIndexOfFirstUnaryOPFromRight,
} from "./utils";

interface CalcState {
  display: string;
  expr: string[];
}

export const initState = {
  expr: ["0"],
  display: "0",
};

export const getNextState = (state: CalcState, keyPress: string): CalcState => {
  // Shorten props
  let expr = state.expr;
  let display = state.display;

  // Clear All
  if (keyPress === Key.AC) {
    expr = ["0"];
    display = "0";
    return { expr: expr, display: display };
  }

  // Is display full
  if (
    isNumber(keyPress) &&
    isNumber(expr[expr.length - 1]) &&
    isDisplayFull(display)
  )
    return { ...state };

  // Digit
  if (isNumber(keyPress)) {
    if (expr[expr.length - 1] === Key.EQ) expr = ["0"];
    const lastItem = expr[expr.length - 1];
    if (isNumber(lastItem)) {
      expr[expr.length - 1] === "0"
        ? (expr[expr.length - 1] = keyPress)
        : (expr[expr.length - 1] += keyPress);
    } else {
      expr.push(keyPress);
    }
    display = expr[expr.length - 1];
  }
  // Unary operations
  else if (
    isOP(keyPress).unary &&
    !isOP(expr[expr.length - 1]).binary &&
    expr[expr.length - 1] !== Key.EQ
  ) {
    expr.push(expr[expr.length - 1]);
    expr[expr.length - 2] = keyPress;
    let firstOPIndex = getIndexOfFirstUnaryOPFromRight(expr);
    display = evaluateExpression([...expr].splice(firstOPIndex));
  }
  // Binary operations
  else if (isOP(keyPress).binary && expr[expr.length - 1] !== Key.EQ) {
    expr.push(keyPress);
  }
  // Floating point
  else if (keyPress === Key.FP) {
    expr[expr.length - 1] += ".";
  }
  // Negativity
  else if (keyPress === Key.SIGN) {
    expr[expr.length - 1] = (Number(expr[expr.length - 1]) * -1).toString();
    display = (Number(display) * -1).toString();
  }
  // Evaluate expression
  else if (keyPress === Key.EQ) {
    expr.push(keyPress);
    display = evaluateExpression(expr).toString();
  }

  return { expr: expr, display: display };
};
