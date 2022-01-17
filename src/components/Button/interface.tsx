import { ReactElement } from "react";

export interface ButtonProps {
  content: string | ReactElement;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}
