import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { sidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { Menu } from 'antd';
import { UserModel } from '@app/domain/UserModel';
import { readToken } from '@app/services/localStorage.service';
import axios from 'axios';
import Icon, { TeamOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { GroupModel } from '@app/domain/GroupModel';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { setGroups } from '@app/store/slices/groupSlice';
import { getGroups } from '@app/api/group.api';
import { getPresentation } from '@app/api/presentation.api';
import { setPresentation } from '@app/store/slices/presentationSlice';
import { ReactComponent as PresentationIcon } from '@app/assets/icons/presentation.svg';
interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const sidebarNavFlat = sidebarNavigation.reduce(
  (result: SidebarNavigationItem[], current) =>
    result.concat(current.children && current.children.length > 0 ? current.children : current),
  [],
);

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [navItem, setNavItem] = React.useState<SidebarNavigationItem[]>(sidebarNavigation);

  const groups = useAppSelector((state) => state.groups);
  const presentations = useAppSelector((state) => state.presentations);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!groups.isLoaded) {
      getGroups().then((data) => {
        dispatch(setGroups(data));
      });
    } else if (!presentations.isLoaded) {
      getPresentation().then((data) => {
        dispatch(setPresentation(data));
      });
    } else {
      const res = groups.groups;
      const myGroupsNav = res.myGroups.map((g) => {
        return {
          title: g.name,
          key: g.id,
          // TODO use path variable
          url: `/group/${g.id}`,
          icon: <TeamOutlined />,
        };
      });
      const joinGroupsNav = res.joinGroups.map((g) => {
        return {
          title: g.name,
          key: g.id,
          // TODO use path variable
          url: `/group/${g.id}`,
          icon: <TeamOutlined />,
        };
      });
      const presentationNav = presentations.presentations.map((p: any) => {
        return {
          title: p.name,
          key: p.id,
          // TODO use path variable
          url: `/presentation/${p.id}`,
          icon: <TeamOutlined />,
        };
      });
      setNavItem([
        ...sidebarNavigation,
        {
          title: 'common.mygroup',
          key: 'mygroup',
          icon: <TeamOutlined />,
          children: myGroupsNav,
        },
        {
          title: 'common.joingroup',
          key: 'joingroup',
          icon: <TeamOutlined />,
          children: joinGroupsNav,
        },
        {
          title: 'common.presentation',
          key: 'presentation',
          icon: <PresentationIcon />,
          children: presentationNav,
        },
      ]);
    }
  }, [groups, presentations]);

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {navItem.map((nav) =>
        nav.children && nav.children.length > 0 ? (
          <Menu.SubMenu
            key={nav.key}
            title={t(nav.title)}
            icon={nav.icon}
            onTitleClick={() => setCollapsed(false)}
            popupClassName="d-none"
          >
            {nav.children.map((childNav) => (
              <Menu.Item key={childNav.key} title="">
                <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={nav.key} title="" icon={nav.icon}>
            <Link to={nav.url || ''}>{t(nav.title)}</Link>
          </Menu.Item>
        ),
      )}

      {/* {group?.map((g)=> ).map((group) => (
        <Menu.Item key={group.id} title={group.name} icon={<TeamOutlined/>}>
          <Link to={`/group/${group.id}`}>{group.name}</Link>
        </Menu.Item>
       ))} */}
    </S.Menu>
  );
};

export default SiderMenu;
