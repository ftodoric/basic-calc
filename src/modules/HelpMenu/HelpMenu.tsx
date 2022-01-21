import React from "react";
import { BackSpaceIcon } from "../../components/Icons/BackSpaceIcon";

import * as S from "./styles";

const ControlKeys = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginRight: "10px",
        }}
      >
        <div>AC</div>
        <div>C</div>
        <BackSpaceIcon width="20" height="27" fill="white" />
        <div>MS</div>
        <div>MR</div>
      </div>
      <div
        style={{
          paddingLeft: "10px",
          borderLeft: "solid 1px white",
        }}
      >
        <div>Clear all</div>
        <div>Clear current value only</div>
        <div>Delete one digit</div>
        <div>Store current value</div>
        <div>Retrieve stored value</div>
      </div>
    </>
  );
};

const BasicArithmeticKeys = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginRight: "10px",
        }}
      >
        <div>+</div>
        <div>{"\u2212"}</div>
        <div>{"\u00d7"}</div>
        <div>{"\u00f7"}</div>
        <div>=</div>
        <div>.</div>
      </div>
      <div
        style={{
          paddingLeft: "10px",
          borderLeft: "solid 1px white",
          marginRight: "50px",
          height: "50%",
        }}
      >
        <div>Addition</div>
        <div>Subtraction</div>
        <div>Multiplication</div>
        <div>Division</div>
        <div>Evaluation</div>
        <div>Insert decimal point</div>
      </div>
    </>
  );
};

const UnaryOperatorKeys = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginRight: "10px",
        }}
      >
        <div>{"x\u00b2"}</div>
        <div>{"\u221ax"}</div>
        <div>{"1/x"}</div>
        <div>sin</div>
        <div>cos</div>
        <div>tan</div>
        <div>{"\u00b1"}</div>
      </div>
      <div
        style={{
          paddingLeft: "10px",
          borderLeft: "solid 1px white",
        }}
      >
        <div>Square of x</div>
        <div>Square root of x</div>
        <div>Inverse of x</div>
        <div>Sine value of x</div>
        <div>Cosine value of x</div>
        <div>Tangent value of x</div>
        <div>Negation of x</div>
      </div>
    </>
  );
};

const HelpDescription = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "20px" }}>CONTROL KEYS</div>
      <div
        className="control-keys"
        style={{ display: "flex", marginBottom: "70px" }}
      >
        <ControlKeys />
      </div>

      <div style={{ marginBottom: "20px" }}>ARITHMETIC KEYS</div>
      <div className="math-keys" style={{ display: "flex" }}>
        <BasicArithmeticKeys />
        <UnaryOperatorKeys />
      </div>
    </div>
  );
};

export const HelpMenu = () => {
  const [help, setHelp] = React.useState(false);
  const [helpText, setHelpText] = React.useState(false);

  const toggleHelp = () => {
    setHelp(!help);
    help === false
      ? setTimeout(() => {
          setHelpText(true);
        }, 100)
      : setHelpText(false);
  };

  return (
    <S.Help onClick={toggleHelp} open={help}>
      {helpText ? <HelpDescription /> : "?"}
    </S.Help>
  );
};
