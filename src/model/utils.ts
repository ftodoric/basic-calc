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
const unaryDisplaySets: UnaryDisplaySet[] = [
  { op: Key.SQ, pre: "(", post: ")\u00b2" },
  { op: Key.SQRT, pre: "\u221a", post: "" },
  { op: Key.INV, pre: "1/", post: "" },
  { op: Key.SIN, pre: "sin(", post: ")" },
  { op: Key.COS, pre: "cos(", post: ")" },
  { op: Key.TAN, pre: "tan(", post: ")" },
];
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
      formattedItem.pre = unaryOP!.pre;
      formattedItem.post = unaryOP!.post;
      ctx.unaryBefore = false;
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
      unaryOP = unaryDisplaySets.find((opObj) => {
        return opObj.op === item;
      });
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
