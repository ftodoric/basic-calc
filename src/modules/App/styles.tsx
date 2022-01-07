import styled from "styled-components";

export const BG = styled.div`
  background-color: #b9c9ce;
  min-height: 100vh;
`;

export const UI = styled.div`
  width: 700px;
  margin: auto;
  text-align: center;
  user-select: none;

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

export const Display = styled.div`
  background-color: #39444f;
  padding-right: 10px;
  text-align: right;
  font-size: 40px;
  color: white;
  transition: height 0.2s;
`;

export const Buttons = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-row-gap: 1px;
  grid-column-gap: 1px;
  background-color: #39444f;

  button {
    width: 174.25px;
    border: solid 1px #1d1d1d;
    border-radius: 2px;
    background-color: #23282d;
    box-sizing: border-box;
    padding: 0;
    color: white;
    font-size: 25px;
    height: 50px;

    &.numeral {
      font-size: 35px;
    }

    &.special {
      background-color: #a8641b;

      :hover {
        background-color: #76440e;

        :disabled {
          background-color: #a8641b;
        }
      }
    }

    &.equal {
      background-color: #208a58;

      :hover {
        background-color: #0b4a2d;

        :disabled {
          background-color: #208a58;
        }
      }
    }

    &:hover {
      background-color: #132734;

      :disabled {
        background-color: #23282d;
      }
    }

    &:disabled {
      opacity: 0.3;
    }

    &:focus-visible {
      outline: none;
    }
  }

  @media screen and (max-width: 700px) {
    width: 100%;

    button {
      width: 100%;
    }
  }
`;
