import styled from 'styled-components';

export const Item = styled('div')`
  display: flex;
  width: 100%;
`;
export const Icon = styled('div')`
  padding: 0 0.25rem;
`;

export const MenuButton = styled('div')`
  padding: 0 0.25rem;
  background: transparent;
`;

export const MenuItem = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 1;
  background: var(--background-color);
`;
