import { Key } from "./keyboard";
import { isDisplayFull, isOP, isNumber } from "./utils";

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
  if (isDisplayFull(display)) return { ...state };

  // Digit
  if (isNumber(keyPress)) {
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
  if (isOP(keyPress).unary && !isOP(expr[expr.length - 1]).binary) {
    expr.push(expr[expr.length - 1]);
    expr[expr.length - 2] = keyPress;
  }

  // Binary operations
  if (isOP(keyPress).binary) {
    expr.push(keyPress);
  }

  if (keyPress === Key.FP) {
    expr[expr.length - 1] += ".";
  }

  if (keyPress === Key.SIGN) {
  }

  return { expr: expr, display: display };
};
