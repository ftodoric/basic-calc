import React from "react";
import { Key } from "./keyboard";
import {
  isDisplayFull,
  isOP,
  isNumber,
  evaluateExpression,
  evaluateLastUnaries,
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
 * @param state
 * @param keyPress
 * @returns New calculator state.
 */
const getNextState = (state: CalcState, keyPress: string): CalcState => {
  // Shorten props
  let expr = state.expr;
  let display = state.display;

  // All function calls return new state: {expr: "epression", display: "displayString"}

  // Clear All
  if (keyPress === Key.AC) {
    return allClear();
  }

  // Clear
  if (keyPress === Key.C) {
    return clear(state);
  }

  // KEY PRESS GUARD - Defined constraints
  if (keyPressDenied(state, keyPress)) return { ...state };

  // Digit input
  if (isNumber(keyPress)) {
    return inputDigit(state, keyPress);
  }
  // Unary operator
  else if (isOP(keyPress).unary) {
    return applyUnaryOperator(state, keyPress);
  }
  // Binary operator
  else if (isOP(keyPress).binary) {
    if (expr[expr.length - 1] !== Key.EQ) expr.push(keyPress);
    else {
      expr = [display];
      expr.push(keyPress);
    }
  }
  // Floating point
  else if (keyPress === Key.FP) {
    expr[expr.length - 1] += ".";
  }
  // Evaluate expression
  else if (keyPress === Key.EQ) {
    expr.push(keyPress);
    display = evaluateExpression(expr).toString();
  }

  return { expr: expr, display: display };
};

// CALCULATOR FUNCTIONS

/**
 * Defines conditions for key press to be allowed.
 * Only keys "AC" and "C" are allowed in any given situation.
 *
 * Conditions:
 *
 * 1. No Display Error
 * 2. Display must not be full if digit is pressed and last item is number
 *
 * @param state
 * @param keyPress
 * @returns
 */
function keyPressDenied(state: CalcState, keyPress: string) {
  const cond1 = state.display === "Display Error";
  const cond2 =
    isNumber(keyPress) &&
    isNumber(state.expr[state.expr.length - 1]) &&
    isDisplayFull(state.display);

  return cond1 || cond2;
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
  return { expr: state.expr, display: initState().display };
}

/**
 * This function applies chosen unary operator on current value.
 * @param state
 * @param keyPress
 * @returns
 */
function applyUnaryOperator(state: CalcState, keyPress: string) {
  const expr = state.expr;
  let display = state.display;
  const lastTerm = expr[expr.length - 1];

  // If last item in expression is number apply it on it
  if (isNumber(lastTerm)) {
    expr.push(lastTerm);
    expr[expr.length - 2] = keyPress;
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

  // If previous input was a digit, concatenate pressed digit to the last number
  let lastItem = expr[expr.length - 1];
  if (isNumber(lastItem)) {
    lastItem === "0"
      ? (expr[expr.length - 1] = keyPress)
      : (expr[expr.length - 1] += keyPress);
  }
  // Else push new item (new number)
  else {
    expr.push(keyPress);
  }

  // Set display to the last number in expression
  display = expr[expr.length - 1];

  return { expr: expr, display: display };
}

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
    { op: Key.SIGN, pre: "neg(", post: ")" },
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
    formattedItem = {
      pre: "",
      value: isNumber(item) ? item.replace("-", "\u2212") : "",
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
