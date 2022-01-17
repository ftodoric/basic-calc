import styled from "styled-components";

export const Button = styled.button`
  background-color: #d1e8f0;
  padding: 0;
  border: solid 1px #d9eef5;
  font-size: 25px;
  color: #06354f;
  user-select: none;

  :focus-visible {
    outline: none;
  }

  :hover {
    background-color: #abd0dc;
    cursor: pointer;
  }
`;
