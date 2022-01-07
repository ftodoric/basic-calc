export function removeLeadingZeros(stringValue: string): string {
  let counter = 0;
  for (let char of stringValue) {
    if (char === "0") counter++;
    else break;
  }
  return stringValue.slice(counter).length === 0
    ? "0"
    : stringValue.slice(counter);
}

export function evaluateExpression(expr: string): string {
  //Stack simul
  const numbers = [];
  const operations: string[] = [];
  for (let i = 0; i < expr.length; i++) {
    let c = expr.charAt(i);
    //check if it is number
    if (isDigit(c)) {
      //Entry is Digit, it could be greater than one digit number
      let num = 0;
      while (isDigit(c)) {
        num = num * 10 + (parseInt(c) - 0);
        i++;
        if (i < expr.length) c = expr.charAt(i);
        else break;
      }
      i--;
      //push it into stack
      numbers.push(num);
    } else if (c === "(") {
      //push it to operators stack
      operations.push(c);
    }
    //Closed brace, evaluate the entire brace
    else if (c === ")") {
      while (operations[operations.length - 1] !== "(") {
        let output = performOperation(numbers, operations);
        //push it back to stack
        numbers.push(output);
      }
      operations.pop();
    }
    // current character is operator
    else if (isOperator(c)) {
      //1. If current operator has higher precedence than operator on top of the stack,
      //the current operator can be placed in stack
      // 2. else keep popping operator from stack and perform the operation in  numbers stack till
      //either stack is not empty or current operator has higher precedence than operator on top of the stack
      while (
        !(operations.length === 0) &&
        precedence(c) <= precedence(operations[operations.length - 1])
      ) {
        let output = performOperation(numbers, operations);
        //push it back to stack
        numbers.push(output);
      }
      //now push the current operator to stack
      operations.push(c);
    }
  }
  while (!(operations.length === 0)) {
    let output = performOperation(numbers, operations);
    //push it back to stack
    numbers.push(output);
  }
  return numbers.pop()!.toString();
}

function isDigit(value: string) {
  return !isNaN(Number.parseInt(value));
}

function precedence(c: string): number {
  switch (c) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    case "^":
      return 3;
  }
  return -1;
}

function isOperator(c: string): boolean {
  return c === "+" || c === "-" || c === "/" || c === "*" || c === "^";
}

function performOperation(numbers: number[], operations: string[]) {
  let a = numbers.pop();
  let b = numbers.pop();
  let operation = operations.pop();
  switch (operation) {
    case "+":
      return a! + b!;
    case "-":
      return b! - a!;
    case "*":
      return a! * b!;
    case "/":
      if (a === 0) throw new Error("Cannot divide by zero");
      return b! / a!;
  }
  return 0;
}
