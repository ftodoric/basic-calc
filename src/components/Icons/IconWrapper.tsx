import * as React from "react";

export interface IconWrapperProps {
  children: React.ReactNode;
}

export interface IconStyleProps {
  width?: string;
  height?: string;
  viewBox?: string;
  fill?: string;
}

const defaultStyle: IconStyleProps = {
  width: "24",
  viewBox: "0 0 24 24",
  fill: "#000",
};

export const IconWrapper = (props: IconWrapperProps & IconStyleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // Styles
      width={props.width ? props.width : defaultStyle.width}
      height={props.height ? props.height : defaultStyle.width}
      viewBox={props.viewBox ? props.viewBox : defaultStyle.viewBox}
      fill={props.fill ? props.fill : defaultStyle.fill}
    >
      {props.children}
    </svg>
  );
};
