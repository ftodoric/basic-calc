/**
 * Object that is exposed to the app.
 */
export interface Calculator {
  state: { expression: string; display: string };
  press: (keyPress: string) => void;
}

/**
 * Inner state of the calculator.
 * Expression is represented as list of string values for ease of manipulation.
 */
export interface CalcState {
  expr: string[];
  display: string;
}
