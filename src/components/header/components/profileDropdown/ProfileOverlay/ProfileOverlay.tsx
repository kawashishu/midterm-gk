import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './ProfileOverlay.styles';
import { DropdownMenu } from '@app/components/header/Header.styles';
import { GoogleLogout } from 'react-google-login';
export const ProfileOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DropdownMenu selectable={false} {...props}>
      <S.MenuItem key={0}>
        <S.Text>
          <Link to="/profile">{t('profile.title')}</Link>
        </S.Text>
      </S.MenuItem>
      <S.ItemsDivider />
      <GoogleLogout
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
        render={(renderProps) => (
          <S.MenuItem key={1} onClick={renderProps.onClick}>
            <S.Text>
              <Link to="/logout">{t('header.logout')}</Link>
            </S.Text>
          </S.MenuItem>
        )}
        onLogoutSuccess={() => {
          navigate('/logout');
        }}
      />
    </DropdownMenu>
  );
};
