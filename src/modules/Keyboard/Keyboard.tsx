import React from "react";
import { Button } from "../../components/Button";
import * as S from "./styles";

import { layout } from "../../model/keyboard";

interface KeyboardProps {
  onPress: (key: string) => void;
}

export const Keyboard = (props: KeyboardProps) => {
  return (
    <S.Keyboard>
      {layout.map((row, i) => {
        return (
          <div key={i}>
            {row.map((item, j) => (
              <Button
                key={j}
                content={item.content}
                onClick={() => props.onPress(item.key)}
              />
            ))}
          </div>
        );
      })}
    </S.Keyboard>
  );
};
