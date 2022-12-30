import styled from 'styled-components';
import loginBackground from '@app/assets/images/login-bg.webp';

export const BackgroundWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: url(${loginBackground});
  background-size: cover;
  position: relative;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
