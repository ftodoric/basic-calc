import React from "react";
import { IntlProvider } from "react-intl";

import * as Styled from "./styles";

import { messages } from "../../messages/locale";
import { useCalculator } from "../../model/calculator";
import { Keyboard } from "../Keyboard";
import { HelpMenu } from "../HelpMenu";

export function App() {
  // Locale
  const [localeMessages, setLocaleMessages] = React.useState(messages.en);

  // Calculator custom hook
  const calculator = useCalculator();

  // Set locale messages based on two letter country code
  function changeLocale(locale: string) {
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

  // On startup determine locale based on user's location
  React.useEffect(() => {
    fetch(
      "https://api.freegeoip.app/json/?apikey=7cea9300-7b18-11ec-ade9-f557f35592ba"
    )
      .then((res) => res.json())
      .then((res) => {
        changeLocale(res.country_code);
      });
    setTimeout(() => {}, 1000);
  }, []);

  return (
    <IntlProvider locale={"en"} messages={localeMessages}>
      <Styled.BG>
        <Styled.UI>
          <Styled.Display>
            <div className="expression">{calculator.state.expression}</div>
            <div className="display">{calculator.state.display}</div>
          </Styled.Display>
          <Keyboard onPress={calculator.press} />
          <HelpMenu changeLocale={changeLocale} />
        </Styled.UI>
      </Styled.BG>
    </IntlProvider>
  );
}
