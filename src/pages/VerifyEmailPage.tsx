import { verifyEmail } from '@app/api/auth.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      verifyEmail(token);
      navigate('/');
    } else {
      notificationController.error({ message: t('verifyEmail.tokenError') });
      navigate('/auth/login');
    }
  }, [token]);
  return (
    <>
      <PageTitle>{'Verify email'}</PageTitle>
      <h1>Veifing your email</h1>
    </>
  );
};

export default VerifyEmailPage;
