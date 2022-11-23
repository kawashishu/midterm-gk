import { UserModel } from '@app/domain/UserModel';
const avatarImg = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar5.webp';

const testUser = {
  id: 1,
  firstName: 'Chris',
  lastName: 'Johnson',
  imgUrl: avatarImg,
  userName: '@john1989',
  email: {
    name: 'chris.johnson@altence.com',
    verified: true,
  },
  phone: {
    number: '+18143519459',
    verified: true,
  },
  sex: 'male',
  birthday: '01/26/2022',
  lang: 'en',
  country: 'GB',
  city: 'London',
  address1: '14 London Road',
  zipcode: 5211,
  website: 'altence.com',
  socials: {
    twitter: '@altence_team',
    facebook: 'https://facebook.com/groups/1076577369582221',
    linkedin: 'https://linkedin.com/company/altence',
  },
};
interface Tokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}
export const persistToken = (tokens: Tokens): void => {
  localStorage.setItem('accessToken', JSON.stringify(tokens.access));
  localStorage.setItem('refreshToken', JSON.stringify(tokens.refresh));
};

export const readToken = (): string => {
  const token = localStorage.getItem('accessToken');
  return token ? JSON.parse(token).token : '';
};

export const readRefreshToken = (): string => {
  const token = localStorage.getItem('refreshToken');
  return token ? JSON.parse(token).token : '';
};

export const persistUser = (user: UserModel): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserModel | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : testUser;
};

export const deleteToken = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
export const deleteUser = (): void => localStorage.removeItem('user');
