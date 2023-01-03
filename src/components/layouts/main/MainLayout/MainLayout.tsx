import { DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Header } from '../../../header/Header';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import MainSider from '../sider/MainSider/MainSider';
import * as S from './MainLayout.styles';

const MainLayout: React.FC<any> = ({ socket }: { socket: Socket }) => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const group = useAppSelector((state) => state.groups);
  const [listenNotifications, setListenNotifications] = useState<string[]>([]);

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);

  useEffect(() => {
    setIsTwoColumnsLayout([DASHBOARD_PATH].includes(location.pathname) && isDesktop);
  }, [location.pathname, isDesktop]);

  useEffect(() => {
    if (group.isLoaded) {
      group.groups.myGroups.forEach((group) => {
        if (!listenNotifications.includes(group.id)) {
          socket.on(`notify:${group.id}`, (data) => {
            notificationController.info({
              message: data.title,
              description: data.message + ` at group ${group.name}`,
            });
          });
        }
      });
      group.groups.joinGroups.forEach((group) => {
        if (!listenNotifications.includes(group.id)) {
          socket.on(`notify:${group.id}`, (data) => {
            notificationController.info({
              message: data.title,
              description: data.message + `at group ${group.name}`,
            });
          });
        }
      });
      setListenNotifications((prev) => {
        return [
          ...prev,
          ...group.groups.myGroups.map((group) => group.id),
          ...group.groups.joinGroups.map((group) => group.id),
        ];
      });
    }
  }, [group]);

  return (
    <S.LayoutMaster>
      <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
      <S.LayoutMain>
        <MainHeader isTwoColumnsLayout={isTwoColumnsLayout}>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={isTwoColumnsLayout} />
        </MainHeader>
        <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
          <div>
            <Outlet />
          </div>
        </MainContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;
