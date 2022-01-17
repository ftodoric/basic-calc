import React from "react";
import { Buttons } from "../../modules/Buttons";

import * as Calc from "./styles";

export function App() {
  const [display] = React.useState("-1234.123412");

  return (
    <Calc.BG>
      <Calc.UI>
        <Calc.Display>{display}</Calc.Display>
        <Buttons />
      </Calc.UI>
    </Calc.BG>
  );
}
