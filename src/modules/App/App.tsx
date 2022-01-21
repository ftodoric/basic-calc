import * as Styled from "./styles";

import { Keyboard } from "../Keyboard";
import { useCalculator } from "../../model/calculator";
import { HelpMenu } from "../HelpMenu";

export function App() {
  const calculator = useCalculator();

  return (
    <Styled.BG>
      <Styled.UI>
        <Styled.Display>
          <div className="expression">{calculator.state.expression}</div>
          <div className="display">{calculator.state.display}</div>
        </Styled.Display>
        <Keyboard onPress={calculator.press} />
        <HelpMenu />
      </Styled.UI>
    </Styled.BG>
  );
}
