import styled from 'styled-components';
import { Col } from 'antd';
import { LAYOUT, media } from '@app/styles/themes/constants';

export const RightSideCol = styled(Col)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${LAYOUT.desktop.headerHeight});
  background-color: var(--sider-background-color);
  overflow-y: auto;
`;

export const LeftSideCol = styled(Col)`
  @media only screen and ${media.xl} {
    padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
    height: calc(100vh - ${LAYOUT.desktop.headerHeight});
    overflow: auto;
  }
`;

export const Space = styled.div`
  margin: 1rem 0;
`;

export const ScrollWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 250px;

  .ant-card-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
`;

export const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 15px;

  background: black;

  min-height: 300px;
  overflow-y: auto;
`;

export const Item = styled.div`
  background: red;
  height: 150px;
  flex-shrink: 0;
`;

//
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: var(--text-main-color);
  position: relative;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;
export const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
`;

export const SectionContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

export const LinkWrapper = styled.div`
  gap: 10px;
  width: 100%;
  overflow-wrap: break-word;
  background-color: #cccccc4f;
`;

export const FloatButton = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 10;
`;
