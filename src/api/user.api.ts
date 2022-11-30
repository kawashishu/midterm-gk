import { UserModel } from '@app/domain/UserModel';
import { httpApi } from './http.api';

export const updateUserImg = (imgUrl: string): Promise<UserModel> =>
  httpApi.post<UserModel>('users/update-img', { imgUrl }).then(({ data }) => data);

export const searchUsers = (search: string): Promise<UserModel[]> =>
  httpApi.get<UserModel[]>(`users/search?email=${search}`).then(({ data }) => data);
