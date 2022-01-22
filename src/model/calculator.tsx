import React from "react";

import { Calculator, CalcState } from "./interface";

import { Key } from "./keyboard";
import {
  isDisplayFull,
  isOP,
  isUnary,
  isBinary,
  isNumber,
  evaluateExpression,
  evaluateLastUnaries,
  removeLastUnaries,
} from "./utils";

/**
 * Custom hook that provides calculator's press function and it's current state.
 * State consists of expression stack and display value.
 *
 * @returns {Calculator}
 */
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
 * Single memory storage.
 * Memory is encapsulated as there is no need for it from the outside of this module.
 */
let memory: string = "";

// Return a deep copy of the initial state to make it reusable
const initState = (): CalcState => {
  return JSON.parse(JSON.stringify({ expr: ["0"], display: "0" }));
};

/**
 * This method determines next internal state of the calculator based on it's current state and the key press.
 * All calculator functions return new state: {expr: "epression", display: "displayString"}
 *
 * @param {CalcState} state
 * @param {string} keyPress
 * @returns {CalcState} New calculator state.
 */
const getNextState = (state: CalcState, keyPress: string): CalcState => {
  // All clear
  if (keyPress === Key.AC) {
    return allClear();
  }

  // KEY PRESS GUARD - Defined constraints
  if (keyPressDenied(state, keyPress)) return { ...state };

  // Clear
  if (keyPress === Key.C) {
    return clear(state);
  }
  // Backspace
  else if (keyPress === Key.BCKSP) {
    return applyBackspace(state);
  }
  // Memory store
  else if (keyPress === Key.MS) {
    return memoryStore(state);
  }
  // Memory retrieve
  else if (keyPress === Key.MR) {
    return memoryRetrieve(state);
  }
  // Unary operator
  else if (isUnary(keyPress)) {
    return applyUnaryOperator(state, keyPress);
  }
  // Binary operator
  else if (isBinary(keyPress)) {
    return insertBinaryOperator(state, keyPress);
  }
  // Digit input
  else if (isNumber(keyPress)) {
    return insertDigit(state, keyPress);
  }
  // Floating point
  else if (keyPress === Key.FP) {
    return insertFloatingPoint(state, keyPress);
  }
  // Evaluator ("=")
  else {
    return evaluate(state, keyPress);
  }
};

/**
 * CALCULATOR FUNCTIONS
 *
 * Expression is stored as a list and each list item is referred as an "item" in the rest of the program.
 */

/**
 * Defines universal conditions when the key press is not allowed.
 * Only one condition evaluated in "true" will not allow current key press.
 * Only "AC" key is allowed in any given situation.
 *
 * Conditions:
 * 1. Display Error or Math Error
 *
 * @param state
 * @param keyPress
 * @returns
 */
export function keyPressDenied(state: CalcState, keyPress: string) {
  const cond1 =
    state.display === "Display Error" || state.display === "Math Error";

  return cond1;
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
  // Shorten expr variable, changes the original object because the reference is passed
  const expr = state.expr;

  // Ignored when:
  // 1. Display value is 0 and last item is a binary operator
  // 2. Last item is not a number
  const cond1 = state.display === "0" && isOP(expr[expr.length - 1]).binary;
  const cond2 = !isNumber(expr[expr.length - 1]);
  if (cond1 || cond2) return { ...state };

  // Removes not only the last number, but all unary operators applied on it
  removeLastUnaries(expr);
  if (expr.length === 0) expr[0] = "0";

  return {
    expr: expr,
    display: initState().display,
  };
}

/**
 * "Memory store" function stores the current value (display value).
 * Leaves display and expression intact.
 * @param state
 * @returns
 */
function memoryStore(state: CalcState): CalcState {
  memory = state.display;
  return { ...state };
}

/**
 * "Memory retrieve" function retrieves stored value.
 * Replace any display value and replace the last item in the expression along with applied unaries.
 * @param state
 * @returns
 */
function memoryRetrieve(state: CalcState): CalcState {
  if (isNumber(state.expr[state.expr.length - 1]))
    removeLastUnaries(state.expr);
  return insertDigit(state, memory);
}

/**
 * Deletes one digit in the current value.
 * @param state
 * @returns
 */
function applyBackspace(state: CalcState): CalcState {
  const expr = state.expr;
  let display = state.display;
  const lastItem = expr[expr.length - 1];

  // Ignore when:
  // 1. Last item is evaulator
  // 2. Penultimate item is unary operator
  // 3. Last item is binary operator
  const cond1 = lastItem === Key.EQ;
  const cond2 = isOP(state.expr[state.expr.length - 2]).unary;
  const cond3 = isOP(lastItem).binary;
  if (cond1 || cond2 || cond3) return { ...state };

  // Remove last digit from the display if not length of 1
  if (display.length !== 1) display = display.slice(0, -1);
  // Else reset to 0
  else {
    display = "0";
  }

  // Replace the last item in the expression with the display value
  // Replace with 0 only when the expression has one item left
  // Remove floating point with Number().toString() conversion
  if (display !== "0" || expr.length === 1)
    expr[expr.length - 1] = Number(display).toString();
  // Else remove the last item
  else {
    expr.pop();
  }

  return { expr: expr, display: display };
}

/**
 * This function applies the unary operator on the current value.
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
 * This function adds binary operator and expects second operand after.
 * @param state
 * @param keyPress
 * @returns
 */
function insertBinaryOperator(state: CalcState, keyPress: string): CalcState {
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
function insertDigit(state: CalcState, keyPress: string): CalcState {
  const isIgnored =
    isNumber(state.expr[state.expr.length - 1]) &&
    !isOP(state.expr[state.expr.length - 2]).unary &&
    isDisplayFull(state.display);

  if (isIgnored) return { ...state };

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
  const lastItem = state.expr[state.expr.length - 1];
  const isIgnored =
    isOP(state.expr[state.expr.length - 2]).unary ||
    isOP(lastItem).binary ||
    lastItem.includes(".") ||
    lastItem === Key.EQ;

  if (isIgnored) return { ...state };

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
  const isIgnored = state.expr[state.expr.length - 1] === Key.EQ;
  if (isIgnored) return { ...state };

  const expr = state.expr;
  expr.push(keyPress);
  const display = evaluateExpression(expr).toString();
  return { expr: expr, display: display };
}

// TODO: refactor
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
