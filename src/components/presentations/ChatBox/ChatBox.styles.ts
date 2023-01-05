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
export const ChatBox = styled.div`
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

export const ChatList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  color: #000;
  max-height: 300px;
  max-width: 350px;
`;

export const ChatHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--sider-background-color);
  padding: 0.25rem 1rem;
`;

export const ChatAcion = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const ChatInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
