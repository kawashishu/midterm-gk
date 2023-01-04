import styled, { css } from 'styled-components';
import { Layout } from 'antd';
import { LAYOUT, media } from '@app/styles/themes/constants';

const { Content } = Layout;

interface HeaderProps {
  $isTwoColumnsLayout: boolean;
}

export default styled(Content)<HeaderProps>`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  @media only screen and ${media.xl} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        padding: 0;
      `}
  }
`;
