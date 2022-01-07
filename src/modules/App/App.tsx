import React from "react";
import { Button } from "../../components/Button/Button";
import { evaluateExpression, removeLeadingZeros } from "../../utils/functions";

import * as Calc from "./styles";

export function App() {
  // Calculator states
  const [on, setOn] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState("0");
  const [resetOnNextPress, setResetOnNextPress] = React.useState(true);

  //Power state
  const togglePower = () => {
    setOn(!on);
    if (!on) {
      clearDisplay();
      clearExpr();
    }
  };

  // Expression stack
  const [expr, setExpr] = React.useState("");
  React.useEffect(() => {
    console.log(expr);
  });

  //Evaluate
  const evaluate = () => {
    setDisplayValue(evaluateExpression(expr));
    setResetOnNextPress(true);
    clearExpr();
  };

  const clearDisplay = () => {
    setDisplayValue("0");
  };

  const clearExpr = () => {
    setExpr("");
  };

  // Memory operations
  const memSave = () => {};
  const memGet = () => {};

  // Digit input
  const pressDigit = (digit: number) => {
    let val = displayValue;
    if (resetOnNextPress) val = "0";
    setResetOnNextPress(false);
    setDisplayValue(removeLeadingZeros(val.concat(digit.toString())));
    setExpr(expr + removeLeadingZeros(digit.toString()));
  };

  // Binary operations
  const pressBinOP = (binOP: string) => {
    setExpr(expr + binOP);
    setResetOnNextPress(true);
  };

  return (
    <Calc.BG>
      <Calc.UI>
        <Calc.Display style={{ height: on ? "50px" : "0px" }}>
          {on ? displayValue : ""}
        </Calc.Display>
        <Calc.Buttons>
          <Button className="center" content="O" onclick={togglePower} />
          <Button
            className="center"
            content="C"
            onclick={clearDisplay}
            disabled={!on}
          />
          <Button content="P" onclick={memSave} disabled={!on} />
          <Button content="G" onclick={memGet} disabled={!on} />
          <Button
            className="numeral"
            content="0"
            onclick={() => pressDigit(0)}
            disabled={!on}
          />
          <Button disabled={!on} />
          <Button content="," disabled={!on} />
          <Button content={"\u00b1"} onclick={() => {}} disabled={!on} />
          <Button
            className="numeral"
            content="1"
            onclick={() => pressDigit(1)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="2"
            onclick={() => pressDigit(2)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="3"
            onclick={() => pressDigit(3)}
            disabled={!on}
          />
          <Button
            className="special"
            content="+"
            onclick={() => pressBinOP("+")}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="4"
            onclick={() => pressDigit(4)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="5"
            onclick={() => pressDigit(5)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="6"
            onclick={() => pressDigit(6)}
            disabled={!on}
          />
          <Button
            className="special"
            content={"\u2212"}
            disabled={!on}
            onclick={() => pressBinOP("-")}
          />
          <Button
            className="numeral"
            content="7"
            onclick={() => pressDigit(7)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="8"
            onclick={() => pressDigit(8)}
            disabled={!on}
          />
          <Button
            className="numeral"
            content="9"
            onclick={() => pressDigit(9)}
            disabled={!on}
          />
          <Button
            className="special"
            content={"\u00d7"}
            disabled={!on}
            onclick={() => pressBinOP("*")}
          />
          <Button content={"x\u00b2"} disabled={!on} />
          <Button content={"\u221ax"} disabled={!on} />
          <Button content="1/x" disabled={!on} />
          <Button
            className="special"
            content={"\u00f7"}
            disabled={!on}
            onclick={() => pressBinOP("/")}
          />
          <Button content="sin" disabled={!on} />
          <Button content="cos" disabled={!on} />
          <Button content="tan" disabled={!on} />
          <Button
            className="equal"
            content="="
            onclick={evaluate}
            disabled={!on}
          />
        </Calc.Buttons>
      </Calc.UI>
    </Calc.BG>
  );
}
