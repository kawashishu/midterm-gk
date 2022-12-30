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
