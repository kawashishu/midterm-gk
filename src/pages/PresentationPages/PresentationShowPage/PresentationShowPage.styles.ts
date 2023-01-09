import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  color: var(--text-main-color);
  position: relative;
`;

export const Action = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 40px;
`;

export const FloatButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    padding: 0.5rem;
    position: relative;
  }

  div:hover {
    cursor: pointer;
    scale: 1.2;
  }
`;

export const Notify = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.5rem;
  font-weight: bold;
  color: red;
`;
