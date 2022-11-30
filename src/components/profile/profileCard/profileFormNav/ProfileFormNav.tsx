import React from 'react';
import { PersonalInfo } from './nav/PersonalInfo/PersonalInfo';

interface ProfileFormNavProps {
  menu: string;
}

export const ProfileFormNav: React.FC<ProfileFormNavProps> = ({ menu }) => {
  let currentMenu;

  switch (menu) {
    case 'info': {
      currentMenu = <PersonalInfo />;
      break;
    }

    default: {
      currentMenu = null;
    }
  }

  return currentMenu;
};
