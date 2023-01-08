import styled from 'styled-components';

export const Float = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 30%;
  right: 30%;
  z-index: 100;

  ${({ $visible }) =>
    !$visible &&
    `
    display: none;
    `}
`;
export const QuestionBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid var(--sider-background-color);
  border-radius: 10px;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  color: #000;
  max-height: 300px;
  max-width: 350px;
`;

export const QuestionHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--sider-background-color);
  padding: 0.25rem 1rem;
`;

export const QuestionAcion = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const QuestionInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Question = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--sider-background-color);
  border-radius: 10px;
  padding: 0.25rem 1rem;
  gap: 10px;
`;

export const LikeSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  hover: pointer;
  // i want to change the color of green when hover the effect radiates blue color continuously, looks like broadcast
  &:hover {
    color: green;
  }
`;
