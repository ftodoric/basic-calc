import styled from "styled-components";

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;

  button {
    width: 100px;
    height: 90px;
  }

  @media screen and (max-width: 450px) {
    button {
      width: 25%;
      height: 80px;
    }
  }
`;
