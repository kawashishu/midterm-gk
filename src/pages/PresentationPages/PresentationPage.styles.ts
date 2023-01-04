import styled from 'styled-components';
import { Col, Row as AntdRow, Tabs as AntdTabs } from 'antd';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Divider as AntDivider } from 'antd';

export const Row = styled(AntdRow)`
  height: 100%;
  padding-left: 5rem;
`;

export const RightSideCol = styled(Col)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--sider-background-color);
  overflow-y: auto;
`;

export const LeftSideCol = styled(Col)`
  background-color: var(--additional-background-color);
  @media only screen and ${media.xl} {
    height: 100%;
  }
`;

export const Tabs = styled(AntdTabs)`
  height: 100%;
  .ant-tabs {
    height: 100%;
  }
  .ant-tabs-content-holder {
    height: 100%;
  }
  .ant-tabs-content {
    height: 100%;
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
  z-index: 100;
`;

export const Form = styled(BaseForm)`
  width: 100%;
`;

export const Divider = styled(AntDivider)`
  border-top: 1px solid #fff;
`;

export const SliceNav = styled.div`
  gap: 15px;
  width: 100%;
  height: 90%;
  color: var(--text-main-color);
  position: relative;
  overflow-x: scroll;
`;

export const SliceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: var(--text-main-color);
  position: relative;
`;

export const ContentSection = styled.div`
  padding: 15px 0px;
`;

export const PresentationAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.5rem;
  width: 100%;
  gap: 15px;
`;
