import styled from "styled-components";

export const BG = styled.div`
  background: linear-gradient(#2798a5, #2764a5);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const UI = styled.div`
  width: 400px;
  height: 710px;
  border-radius: 10px;

  @media screen and (max-width: 450px) {
    width: calc(100% - 50px);
  }
`;

export const Display = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  font-size: 42px;
  height: 80px;
  padding-right: 10px;
  background: #000;
  opacity: 0.5;
  color: white;
  user-select: none;

  .expression {
    font-size: 18px;
    margin: 5px 0 -5px;
    color: #b5b5b5;
  }

  @media screen and (max-width: 420px) {
    font-size: 11vw;

    .expression {
      font-size: 4vw;
    }
  }
`;
