import React from "react";
import { useIntl } from "react-intl";

import { BackSpaceIcon } from "../../components/Icons/BackSpaceIcon";

import * as S from "./styles";

const useMessage = (id: string) => {
  const intl = useIntl();
  return intl.formatMessage({ id: id });
};

const ControlKeys = () => {
  return (
    <div style={{ marginTop: "20px", display: "flex" }}>
      <S.LeftKeys>
        <div>{useMessage("key.ac")}</div>
        <div>{useMessage("key.c")}</div>
        <BackSpaceIcon width="20" height="27" fill="white" />
        <div>{useMessage("key.ms")}</div>
        <div>{useMessage("key.mr")}</div>
      </S.LeftKeys>
      <S.RightDescription>
        <div>{useMessage("help.ac")}</div>
        <div>{useMessage("help.c")}</div>
        <div>{useMessage("help.bckspc")}</div>
        <div>{useMessage("help.ms")}</div>
        <div>{useMessage("help.mr")}</div>
      </S.RightDescription>
    </div>
  );
};

const BasicArithmeticKeys = () => {
  return (
    <div style={{ display: "flex", marginRight: "50px" }}>
      <S.LeftKeys>
        <div>+</div>
        <div>{useMessage("key.sub")}</div>
        <div>{useMessage("key.mul")}</div>
        <div>{useMessage("key.div")}</div>
        <div>=</div>
        <div>.</div>
      </S.LeftKeys>
      <S.RightDescription>
        <div>{useMessage("help.add")}</div>
        <div>{useMessage("help.sub")}</div>
        <div>{useMessage("help.mul")}</div>
        <div>{useMessage("help.div")}</div>
        <div>{useMessage("help.eq")}</div>
        <div>{useMessage("help.fp")}</div>
      </S.RightDescription>
    </div>
  );
};

const UnaryOperatorKeys = () => {
  return (
    <>
      <S.LeftKeys>
        <div>{useMessage("key.sq")}</div>
        <div>{useMessage("key.sqrt")}</div>
        <div>{useMessage("key.inv")}</div>
        <div>{useMessage("key.sin")}</div>
        <div>{useMessage("key.cos")}</div>
        <div>{useMessage("key.tan")}</div>
        <div>{useMessage("key.neg")}</div>
      </S.LeftKeys>
      <S.RightDescription>
        <div>{useMessage("help.sq")}</div>
        <div>{useMessage("help.sqrt")}</div>
        <div>{useMessage("help.inv")}</div>
        <div>{useMessage("help.sin")}</div>
        <div>{useMessage("help.cos")}</div>
        <div>{useMessage("help.tan")}</div>
        <div>{useMessage("help.neg")}</div>
      </S.RightDescription>
    </>
  );
};

const HelpText = ({
  changeLocale,
}: {
  changeLocale: (locale: string) => void;
}) => {
  function handleLangPick(e: React.MouseEvent, locale: string) {
    e.stopPropagation();
    changeLocale(locale);
  }

  return (
    <S.HelpText>
      <S.LangPicker>
        <span
          onClick={(e) => handleLangPick(e, "en")}
          style={{ color: "lightblue" }}
        >
          {useMessage("help.en")}
        </span>
        <span onClick={(e) => handleLangPick(e, "hr")}>
          {useMessage("help.hr")}
        </span>
        <span
          onClick={(e) => handleLangPick(e, "de")}
          style={{ color: "#b13434" }}
        >
          {useMessage("help.de")}
        </span>
      </S.LangPicker>

      <div style={{ textTransform: "uppercase" }}>
        {useMessage("help.control")}
      </div>

      <ControlKeys />

      <div style={{ marginTop: "70px", textTransform: "uppercase" }}>
        {useMessage("help.arithmetic")}
      </div>

      <div className="math-keys" style={{ display: "flex", marginTop: "20px" }}>
        <BasicArithmeticKeys />
        <UnaryOperatorKeys />
      </div>
    </S.HelpText>
  );
};

export const HelpMenu = ({
  changeLocale,
}: {
  changeLocale: (locale: string) => void;
}) => {
  const [help, setHelp] = React.useState(false);
  const [helpText, setHelpText] = React.useState(false);

  const toggleHelp = () => {
    setHelp(!help);
    // Wait some time for transition to finish
    help === false
      ? setTimeout(() => {
          setHelpText(true);
        }, 100)
      : setHelpText(false);
  };

  return (
    <S.Help onClick={toggleHelp} open={help}>
      {helpText ? <HelpText changeLocale={changeLocale} /> : "?"}
    </S.Help>
  );
};
