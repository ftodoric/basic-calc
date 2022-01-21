import styled from "styled-components";

export const Help = styled.div<{ open: boolean }>`
  position: absolute;
  top: ${(props) => (props.open ? "0" : "20px")};
  right: ${(props) => (props.open ? "0" : "20px")};
  width: ${(props) => (props.open ? "100%" : "40px")};
  height: ${(props) => (props.open ? "100%" : "40px")};
  min-height: ${(props) => (props.open ? "710px" : "0")};
  background: ${(props) => (props.open ? "#10373c" : "black")};
  opacity: ${(props) => (props.open ? "0.95" : "0.5")};
  border-radius: ${(props) => (props.open ? "0" : "600px")};
  border-top-right-radius: ${(props) => (props.open ? "0" : "20px")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
  font-weight: bold;
  transition: width 0.3s, height 0.3s, border-radius 0.4s, top 0.5s, right 0.5s;

  @media screen and (max-width: 600px) {
    display: none;
  }
`;
