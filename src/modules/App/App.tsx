import React from "react";
import { Keyboard } from "../Keyboard";
import { getNextState, initState } from "../../model/state";

import * as Styled from "./styles";
import { exprToString } from "../../model/utils";

export function App() {
  const [state, setState] = React.useState(initState);

  const press = (keyPress: string) => {
    const newState = getNextState(state, keyPress);
    setState(newState);
  };

  return (
    <Styled.BG>
      <Styled.UI>
        <Styled.Display>
          <div className="expression">{exprToString(state.expr)}</div>
          <div className="display">{state.display}</div>
        </Styled.Display>
        <Keyboard onPress={press} />
      </Styled.UI>
    </Styled.BG>
  );
}
