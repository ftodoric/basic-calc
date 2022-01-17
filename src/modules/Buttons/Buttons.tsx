import React from "react";
import { Button } from "../../components/Button";
import * as S from "./styles";

import { layout } from "../../model/keyboard";

export const Buttons = () => {
  function press(key: string) {
    console.log(key);
  }

  return (
    <S.Buttons>
      {layout.map((row) => {
        return (
          <div>
            {row.map((item) => (
              <Button content={item.content} onClick={() => press(item.key)} />
            ))}
          </div>
        );
      })}
    </S.Buttons>
  );
};
