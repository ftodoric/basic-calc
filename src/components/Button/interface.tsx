import { ReactElement } from "react";

export interface ButtonProps {
  content?: string | ReactElement;
  className?: string;
  onclick?: () => void;
  disabled?: boolean;
}
