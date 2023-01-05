import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useResponsive } from '@app/hooks/useResponsive';
import { Row } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './DashboardPage.styles';

export const Dashboard = () => {
  const { isDesktop } = useResponsive();

  const { t } = useTranslation();

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <Row>
        <S.Wrap></S.Wrap>
      </Row>
    </>
  );
};
