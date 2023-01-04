import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doGoogleLogin, doSignUp } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { ReactComponent as GoogleIcon } from '@app/assets/icons/google.svg';
import { ReactComponent as FacebookIcon } from '@app/assets/icons/facebook.svg';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './SignUpForm.styles';
import GoogleLogin from 'react-google-login';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const initValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  termOfUse: true,
};

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = (values: SignUpFormData) => {
    setLoading(true);
    dispatch(doSignUp(values))
      .unwrap()
      .then(() => {
        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
          description: t('auth.signUpSuccessDescription'),
        });
        navigate('/auth/login');
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <S.Title>{t('common.signUp')}</S.Title>
        <Auth.FormItem
          name="firstName"
          label={t('common.firstName')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.firstName')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="lastName"
          label={t('common.lastName')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.lastName')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.password')}
          name="password"
          rules={[
            { required: true, message: t('common.requiredField') },
            { min: 8, message: t('common.passwordMinLength') },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number',
            },
          ]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.confirmPassword')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('common.requiredField') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('common.confirmPasswordError')));
              },
            }),
          ]}
        >
          <Auth.FormInputPassword placeholder={t('common.confirmPassword')} />
        </Auth.FormItem>
        <Auth.ActionsWrapper>
          <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <Auth.Text>
                {t('signup.agree')}{' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('signup.termOfUse')}</Auth.LinkText>
                </Link>{' '}
                and{' '}
                <Link to="/" target={'_blank'}>
                  <Auth.LinkText>{t('signup.privacyOPolicy')}</Auth.LinkText>
                </Link>
              </Auth.Text>
            </Auth.FormCheckbox>
          </BaseForm.Item>
        </Auth.ActionsWrapper>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.signUp')}
          </Auth.SubmitButton>
        </BaseForm.Item>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
          render={(props) => (
            <BaseForm.Item noStyle>
              <Auth.SocialButton type="default" onClick={props.onClick}>
                <Auth.SocialIconWrapper>
                  <GoogleIcon />
                </Auth.SocialIconWrapper>
                {t('login.googleLink')}
              </Auth.SocialButton>
            </BaseForm.Item>
          )}
          onSuccess={(res) => {
            dispatch(doGoogleLogin({ idToken: (res as any).tokenId }))
              .unwrap()
              .then(() => navigate('/'))
              .catch((err) => {
                notificationController.error({ message: err.message });
                setLoading(false);
              });
          }}
        />
        {/* <BaseForm.Item noStyle>
          <Auth.SocialButton type="default" htmlType="submit">
            <Auth.SocialIconWrapper>
              <FacebookIcon />
            </Auth.SocialIconWrapper>
            {t('signup.facebookLink')}
          </Auth.SocialButton>
        </BaseForm.Item> */}
        <Auth.FooterWrapper>
          <Auth.Text>
            {t('signup.alreadyHaveAccount')}{' '}
            <Link to="/auth/login">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Auth.FooterWrapper>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
