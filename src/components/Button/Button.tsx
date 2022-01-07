import { ButtonProps } from "./interface";

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={props.className}
      onClick={props.onclick}
      disabled={props.disabled}
    >
      {props.content}
    </button>
  );
};
