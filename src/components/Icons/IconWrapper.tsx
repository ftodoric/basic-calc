import * as React from "react";

export interface IconWrapperProps {
  children: React.ReactElement;
}

export interface IconStyleProps {
  viewport?: string;
  width?: string;
  fill?: string;
}

export const IconWrapper = (props: IconWrapperProps & IconStyleProps) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      //   xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      width={props.width}
      //   style="enable-background:new 0 0 512 512;"
      //   xml:space="preserve"
      fill={props.fill}
    >
      {props.children}
    </svg>
  );
};
