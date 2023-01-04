import { verifyEmail } from '@app/api/auth.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
      navigate('/');
    } else {
      notificationController.error({ message: t('verifyEmail.tokenError') });
      navigate('/auth/login');
    }
  }, [searchParams]);
  return (
    <>
      <PageTitle>{'Verify email'}</PageTitle>
      <h1>Veifing your email</h1>
    </>
  );
};

export default VerifyEmailPage;
