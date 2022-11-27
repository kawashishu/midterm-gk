import { GroupModel } from '@app/domain/GroupModel';
import { httpApi } from './http.api';

export interface GroupResponse {
  myGroups: GroupModel[];
  joinGroups: GroupModel[];
}

export const createGroup = (name: string): Promise<undefined> =>
  httpApi.post<undefined>('groups/create-group/', { name }).then(({ data }) => data);

export const getGroups = (): Promise<GroupResponse> =>
  httpApi.get<GroupResponse>('groups/get-my-group').then(({ data }) => data);

export const toggleOpenForJoin = (groupId: string): Promise<undefined> =>
  httpApi.post<undefined>('groups/toggle-open-for-join', { groupId }).then(({ data }) => data);
