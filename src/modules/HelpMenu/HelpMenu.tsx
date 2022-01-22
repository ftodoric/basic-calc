import React from "react";
import { IntlProvider, useIntl } from "react-intl";
import { BackSpaceIcon } from "../../components/Icons/BackSpaceIcon";

import { messages } from "../../messages/locale";

import * as S from "./styles";

const useMessage = (id: string) => {
  const intl = useIntl();
  return intl.formatMessage({ id: id });
};

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
        <div>{useMessage("help.ac")}</div>
        <div>{useMessage("help.c")}</div>
        <div>{useMessage("help.bckspc")}</div>
        <div>{useMessage("help.ms")}</div>
        <div>{useMessage("help.mr")}</div>
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
        <div>{useMessage("help.add")}</div>
        <div>{useMessage("help.sub")}</div>
        <div>{useMessage("help.mul")}</div>
        <div>{useMessage("help.div")}</div>
        <div>{useMessage("help.eq")}</div>
        <div>{useMessage("help.fp")}</div>
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
        <div>{useMessage("help.sq")}</div>
        <div>{useMessage("help.sqrt")}</div>
        <div>{useMessage("help.inv")}</div>
        <div>{useMessage("help.sin")}</div>
        <div>{useMessage("help.cos")}</div>
        <div>{useMessage("help.tan")}</div>
        <div>{useMessage("help.neg")}</div>
      </div>
    </>
  );
};

const HelpDescription = ({
  onLocaleChange,
}: {
  onLocaleChange: (locale: string) => void;
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "20px" }}>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onLocaleChange("en");
          }}
          style={{ marginRight: "10px", color: "lightblue" }}
        >
          en
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onLocaleChange("hr");
          }}
          style={{ marginRight: "10px" }}
        >
          hr
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onLocaleChange("de");
          }}
          style={{ color: "#b13434" }}
        >
          de
        </span>
      </div>
      <div style={{ marginBottom: "20px", textTransform: "uppercase" }}>
        {useMessage("help.control")}
      </div>
      <div
        className="control-keys"
        style={{ display: "flex", marginBottom: "70px" }}
      >
        <ControlKeys />
      </div>

      <div style={{ marginBottom: "20px", textTransform: "uppercase" }}>
        {useMessage("help.arithmetic")}
      </div>
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

  const [localeMessages, setLocaleMessages] = React.useState(messages.en);

  React.useEffect(() => {
    fetch(
      "https://api.freegeoip.app/json/?apikey=7cea9300-7b18-11ec-ade9-f557f35592ba"
    )
      .then((res) => res.json())
      .then((res) => {
        onLocaleChange(res.country_code);
      });
    setTimeout(() => {}, 1000);
  }, []);

  function onLocaleChange(locale: string) {
    switch (locale.toUpperCase()) {
      case "GB":
      case "US":
        setLocaleMessages(messages.en);
        return;
      case "HR":
        setLocaleMessages(messages.hr);
        return;
      case "DE":
        setLocaleMessages(messages.de);
        return;
      default:
        setLocaleMessages(messages.en);
        return;
    }
  }

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
      {helpText ? (
        <IntlProvider locale={"en"} messages={localeMessages}>
          <HelpDescription onLocaleChange={onLocaleChange} />
        </IntlProvider>
      ) : (
        "?"
      )}
    </S.Help>
  );
};
