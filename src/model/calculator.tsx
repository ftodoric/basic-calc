import React from "react";
import { Key } from "./keyboard";
import {
  isDisplayFull,
  isOP,
  isNumber,
  evaluateExpression,
  evaluateLastUnaries,
  removeLastUnaries,
} from "./utils";

// Interface
interface Calculator {
  state: { expression: string; display: string };
  press: (keyPress: string) => void;
}

interface CalcState {
  expr: string[];
  display: string;
}

// Calculator object
// Return a deep copy to make it reusable
const initState = (): CalcState => {
  return JSON.parse(JSON.stringify({ expr: ["0"], display: "0" }));
};

export const useCalculator = (): Calculator => {
  const [state, setState] = React.useState(initState());

  const press = (keyPress: string) => {
    const newState = getNextState(state, keyPress);
    setState(newState);
  };

  return {
    state: { expression: exprToString(state.expr), display: state.display },
    press: press,
  };
};

/**
 * This method determines next internal state of the calculator based on it's current state and key input.
 *
 * @param {CalcState} state
 * @param {string} keyPress
 * @returns {CalcState} New calculator state.
 */
const getNextState = (state: CalcState, keyPress: string): CalcState => {
  // Clear All
  if (keyPress === Key.AC) {
    return allClear();
  }

  // KEY PRESS GUARD - Defined constraints
  if (keyPressDenied(state, keyPress)) return { ...state };

  // Other keys
  // Clear
  if (keyPress === Key.C) {
    return clear(state);
  }
  // Memory store
  else if (keyPress === Key.MS) {
    return { ...state };
  }
  // Memory retrieve
  else if (keyPress === Key.MR) {
    return { ...state };
  }
  // Backspace
  else if (keyPress === Key.BCKSP) {
    return { ...state };
  }
  // Unary operator
  else if (isOP(keyPress).unary) {
    return applyUnaryOperator(state, keyPress);
  }
  // Binary operator
  else if (isOP(keyPress).binary) {
    return addBinaryOperator(state, keyPress);
  }
  // Digit input
  else if (isNumber(keyPress)) {
    return inputDigit(state, keyPress);
  }
  // Negate operator
  else if (keyPress === Key.NEG) {
    return { ...state };
  }
  // Floating point
  else if (keyPress === Key.FP) {
    return insertFloatingPoint(state, keyPress);
  }
  // Evaluate expression
  else {
    return evaluate(state, keyPress);
  }
};

// CALCULATOR FUNCTIONS

// Expression is stored as a list and each list item is referred as "item" in the rest of the program.
// All function calls return new state: {expr: "epression", display: "displayString"}

/**
 * Defines conditions for key press to be allowed.
 * Only "AC" key is allowed in any given situation.
 *
 * Conditions:
 *
 * 1. No Display Error
 * 2. Display must not be full if digit is pressed and last item is number not modified by an unary operator
 * 3. "C" pressed while 0 on display and operator as last item in expression
 *
 * @param state
 * @param keyPress
 * @returns
 */
function keyPressDenied(state: CalcState, keyPress: string) {
  const lastItem = state.expr[state.expr.length - 1];

  const cond1 = state.display === "Display Error";
  const cond2 =
    isNumber(keyPress) &&
    isNumber(lastItem) &&
    !isOP(state.expr[state.expr.length - 2]).unary &&
    isDisplayFull(state.display);
  const cond3 =
    keyPress === Key.C && state.display === "0" && isOP(lastItem).binary;

  return cond1 || cond2 || cond3;
}

/**
 * "Clear All" function clears the expression and the display back to inital values.
 * @returns
 */
function allClear(): CalcState {
  return initState();
}

/**
 * "Clear" function clears the display, but leaves expression intact.
 * @param state
 * @returns
 */
function clear(state: CalcState): CalcState {
  const expr = state.expr;
  // If last item not a number do nothing
  if (!isNumber(expr[expr.length - 1])) return { ...state };
  if (expr.length !== 1) removeLastUnaries(expr);
  else expr[0] = "0";
  return {
    expr: expr,
    display: initState().display,
  };
}

/**
 * This function applies chosen unary operator on current value.
 * @param state
 * @param keyPress
 * @returns
 */
function applyUnaryOperator(state: CalcState, keyPress: string): CalcState {
  let expr = state.expr;
  let display = state.display;
  const lastTerm = expr[expr.length - 1];

  // If last item in expression is number apply it on it
  if (isNumber(lastTerm)) {
    expr.push(lastTerm);
    expr[expr.length - 2] = keyPress;
  }
  // If expression was evaluated previously
  else if (expr[expr.length - 1] === Key.EQ) {
    // Push current unary operator and then the result of the evaluation
    expr = [keyPress, display];
  }
  // Else apply operator on current display value
  else {
    expr.push(keyPress);
    expr.push(display);
  }

  // After every unary operator display evaluation of last number with applied unaries on him
  display = evaluateLastUnaries(expr);

  return { expr: expr, display: display };
}

/**
 * This function adds binary operator and expects secod operand after.
 * @param state
 * @param keyPress
 * @returns
 */
function addBinaryOperator(state: CalcState, keyPress: string): CalcState {
  let expr = state.expr;
  const display = state.display;

  // If expression was not evaluated previously, push new item
  if (expr[expr.length - 1] !== Key.EQ) {
    // If previous item is another binary operator, replace it with this one
    if (isOP(expr[expr.length - 1]).binary) expr[expr.length - 1] = keyPress;
    // Else push new operator
    else expr.push(keyPress);
  }
  // If expression was evaluated previously, push the display value as number, then push this binary operator
  else {
    expr = [display];
    expr.push(keyPress);
  }
  return { expr: expr, display: display };
}

/**
 * Inserts digit into the expression. Refreshes the display.
 * @param state
 * @param keyPress
 * @returns
 */
function inputDigit(state: CalcState, keyPress: string) {
  let expr = state.expr;
  let display = state.display;

  // If evaluated in previous step, clear expression stack first
  if (expr[expr.length - 1] === Key.EQ) expr = ["0"];

  // If previous input was a digit
  let lastItem = expr[expr.length - 1];
  if (isNumber(lastItem)) {
    // If last number not modified by unary concatenate pressed digit to the last number
    if (!isOP(expr[expr.length - 2]).unary)
      lastItem === "0"
        ? (expr[expr.length - 1] = keyPress)
        : (expr[expr.length - 1] += keyPress);
    // If last number modified by unary, push new number instead of previous number with it's unaries
    else {
      removeLastUnaries(expr);
      expr.push(keyPress);
    }
  }
  // Else push new item (new number)
  else {
    expr.push(keyPress);
  }

  // Set display to the last number in expression
  display = expr[expr.length - 1];

  return { expr: expr, display: display };
}

/**
 * Inserts floating point.
 * @param state
 * @param keyPress
 * @returns
 */
function insertFloatingPoint(state: CalcState, keyPress: string): CalcState {
  let expr = state.expr;
  expr[expr.length - 1] += ".";
  return { expr: expr, display: state.display };
}

/**
 * Evaluates current expression stack and displays the result.
 * @param state
 * @param keyPress
 * @returns
 */
function evaluate(state: CalcState, keyPress: string): CalcState {
  const expr = state.expr;
  expr.push(keyPress);
  const display = evaluateExpression(expr).toString();
  return { expr: expr, display: display };
}

///// Data structures for exprToString function
type ExprItemContext = {
  unaryBefore: boolean;
  binaryBeforeMinus: boolean;
};

type UnaryDisplaySet = {
  op: string;
  pre: string;
  post: string;
};
const unaryDisplaySets = {
  sets: [
    { op: Key.SQ, pre: "(", post: ")\u00b2" },
    { op: Key.SQRT, pre: "\u221a(", post: ")" },
    { op: Key.INV, pre: "1/(", post: ")" },
    { op: Key.SIN, pre: "sin(", post: ")" },
    { op: Key.COS, pre: "cos(", post: ")" },
    { op: Key.TAN, pre: "tan(", post: ")" },
    { op: Key.NEG, pre: "neg(", post: ")" },
  ],
  find: function (op: string) {
    const target = this.sets.find((item) => {
      return item.op === op;
    });
    return target !== undefined ? target : { op: "error", pre: "", post: "" };
  },
};

const binaryDisplaySet = [
  { op: Key.ADD, str: "+" },
  { op: Key.SUB, str: "\u2212" },
  { op: Key.MUL, str: "\u00d7" },
  { op: Key.DIV, str: "\u00f7" },
];

// Parse expression and get displayable string
export function exprToString(expr: string[]): string {
  let unaryOP: UnaryDisplaySet | undefined;
  let displayString: string[] = [];
  let unaryOPStack: UnaryDisplaySet[] = [];

  // Initial context for the first item in expression list
  let ctx: ExprItemContext = {
    unaryBefore: false,
    binaryBeforeMinus: false,
  };
  let formattedItem = { pre: "", value: "", post: "" };
  expr.forEach((item, i) => {
    const formattedValue = isNumber(item)
      ? item.replace("-", "\u2212")
      : item === Key.EQ
      ? "="
      : "";
    formattedItem = {
      pre: "",
      value: formattedValue,
      post: "",
    };
    // 1. Unary was before and binary was before a minus
    // We can ignore binary op, because unary already encloses current value
    if (ctx.unaryBefore) {
      if (!isOP(item).unary) {
        for (let opObj of unaryOPStack) {
          formattedItem.pre = opObj!.pre + formattedItem.pre;
          formattedItem.post += opObj!.post;
          ctx.unaryBefore = false;
        }
        unaryOPStack = [];
      }
    }
    // 2. Only binary was before and current value is negative
    else if (ctx.binaryBeforeMinus) {
      formattedItem.pre = "(";
      formattedItem.post = ")";
      ctx.binaryBeforeMinus = false;
    }
    // 3. No conditions from the last item, proceed normally
    // If current item is an unary operator
    if (isOP(item).unary) {
      unaryOP = unaryDisplaySets.find(item);
      unaryOPStack.push(unaryOP!);
      ctx.unaryBefore = true;
    }
    // If current item is a binary operator
    else if (isOP(item).binary) {
      displayString.push(
        binaryDisplaySet.find((opObj) => {
          return opObj.op === item;
        })!.str
      );
      if (isNumber(expr[i + 1]) && Number(expr[i + 1]) < 0)
        ctx.binaryBeforeMinus = true;
    }

    displayString.push(
      formattedItem.pre + formattedItem.value + formattedItem.post
    );
  });

  return displayString.join("");
}
