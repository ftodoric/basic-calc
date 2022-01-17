import { ButtonProps } from "./interface";

import * as S from "./styles";

export const Button = (props: ButtonProps) => {
  return (
    <S.Button
      className={props.className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.content}
    </S.Button>
  );
};
