import styled from 'styled-components';

export const Container = styled.div<{ $isFullScreen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 80%;
  position: relative;

  ${({ $isFullScreen }) =>
    $isFullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #000000b3;
    `}
`;

export const Options = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  bottom: 40px;
`;

export const FloatButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  z-index: 100;

  :hover {
    cursor: pointer;
    scale: 1.2;
  }
`;
