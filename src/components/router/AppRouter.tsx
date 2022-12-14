import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import LoginPage from '@app/pages/LoginPage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import SignUpPage from '@app/pages/SignUpPage';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import { Dashboard } from '@app/pages/DashboardPages/Dashboard';
import { GroupPage } from '@app/pages/GroupPages/GroupPage';
import { InvitationPage } from '@app/pages/InvitationPage';
import { JoinGroupLink } from '@app/pages/JoinGroupLink';
import { PresentationPage } from '@app/pages/PresentationPages/PresentationPage';
import VerifyEmailPage from '@app/pages/VerifyEmailPage';
import { PresentationShowPage } from '@app/pages/PresentationPages/PresentationShowPage/PresentationShowPage';

import io from 'socket.io-client';
import { PublicPresentationPage } from '@app/pages/PublicPage/PublicPresentationPage';
const socket = io(process.env.REACT_APP_BE_URL || 'http://localhost:5000');

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));

const Logout = React.lazy(() => import('./Logout'));

export const DASHBOARD_PATH = '/';

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout socket={socket} />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/public" element={<Outlet />}>
          <Route index element={<PublicPresentationPage socket={socket} />} />
        </Route>
        <Route
          path="/show/:id"
          element={
            <RequireAuth>
              <PresentationShowPage socket={socket} />
            </RequireAuth>
          }
        />
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<Dashboard />} />
          <Route path="/group/:id" element={<GroupPage socket={socket} />} />
          <Route path="/presentation/:id" element={<PresentationPage socket={socket} />} />

          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
          </Route>
          <Route path="invitations/:id" element={<InvitationPage />} />
          <Route path="join/:id" element={<JoinGroupLink />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<NewPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
