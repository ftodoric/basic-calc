import { Key } from "./keyboard";

export function isNumber(value: string): boolean {
  return value === "" ? false : !isNaN(Number(value));
}

export function isDisplayFull(display: string): boolean {
  return display.replace(/[-.]/g, "").length === 10;
}

// Operation characteristic
const unaryOP = [Key.SQ, Key.SQRT, Key.INV, Key.SIN, Key.COS, Key.TAN];
const binaryOP = [Key.ADD, Key.SUB, Key.MUL, Key.DIV];
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
type ExprItemContext = {
  unaryBefore: boolean;
  binaryBeforeMinus: boolean;
};

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

// Parse expression and get string to display
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
