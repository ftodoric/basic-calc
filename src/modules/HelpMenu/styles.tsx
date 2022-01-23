import styled from "styled-components";

export const Help = styled.div<{ open: boolean }>`
  position: absolute;
  top: ${(props) => (props.open ? "0" : "20px")};
  right: ${(props) => (props.open ? "0" : "20px")};
  width: ${(props) => (props.open ? "100%" : "40px")};
  min-height: ${(props) => (props.open ? "710px" : "0")};
  height: ${(props) => (props.open ? "100%" : "40px")};
  background: ${(props) => (props.open ? "#10373c" : "black")};
  opacity: ${(props) => (props.open ? "0.95" : "0.5")};
  border-radius: ${(props) => (props.open ? "0" : "600px")};
  border-top-right-radius: ${(props) => (props.open ? "0" : "20px")};
  cursor: ${(props) => (props.open ? "default" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
  font-weight: bold;
  transition: width 0.3s, height 0.3s, min-height 0.3s, border-radius 0.4s,
    top 0.5s, right 0.5s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export const HelpText = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LangPicker = styled.div`
  position: absolute;
  top: -70px;
  margin-bottom: 70px;

  span {
    cursor: pointer;

    :hover {
      opacity: 0.5;
    }
  }

  span + span {
    margin-left: 10px;
  }
`;

export const LeftKeys = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
`;

export const RightDescription = styled.div`
  padding-left: 10px;
  border-left: solid 1px white;
`;
