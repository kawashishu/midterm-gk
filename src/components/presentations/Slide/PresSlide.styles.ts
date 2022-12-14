import { Card } from '@app/components/common/Card/Card.styles';
import styled from 'styled-components';

export const Slide = styled(Card)`
  display: flex;
  flex-direction: column;
  min-height: 300px;
  min-width: 500px;
  width: 100%;
  height: 100%;
`;

export const SildeBody = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 15px;
  min-height: 300px;
  min-width: 500px;
`;

export const PreviewSlide = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100px;
  height: 60px;
`;

export const PreviewSlideBody = styled.div`
  width: 100px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 8px;
`;
