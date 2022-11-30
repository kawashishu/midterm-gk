import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';
import React from 'react';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    // TODO use path variable
    url: '/',
    icon: <NftIcon />,
  },
];
