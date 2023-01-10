import { GroupModel } from '@app/domain/GroupModel';
import { UserModel } from '@app/domain/UserModel';
import { httpApi } from './http.api';

export interface GroupResponse {
  myGroups: GroupModel[];
  joinGroups: GroupModel[];
}

export const createGroup = (name: string): Promise<undefined> =>
  httpApi.post<undefined>('groups/create-group/', { name }).then(({ data }) => data);

export const getGroups = (): Promise<GroupResponse> =>
  httpApi.get<GroupResponse>('groups/get-my-group').then(({ data }) => data);

export const getGroup = (groupId: string): Promise<GroupModel> =>
  httpApi.get<GroupModel>(`groups/${groupId}`).then(({ data }) => data);

export const toggleOpenForJoin = (groupId: string): Promise<undefined> =>
  httpApi.post<undefined>('groups/toggle-open-for-join', { groupId }).then(({ data }) => data);

export const removeUserFromGroup = (groupId: string, userId: string): Promise<UserModel> =>
  httpApi.post<UserModel>('groups/remove-user-from-group', { groupId, userId }).then(({ data }) => data);

export const joinGroupByCode = (code: string): Promise<GroupModel> =>
  httpApi.post<GroupModel>('groups/join-group-by-code', { code }).then(({ data }) => data);

export const inviteUsersToGroup = (listUserId: string[], groupId: string): Promise<undefined> =>
  httpApi.post('invite', { groupId, users: listUserId }).then(({ data }) => data);

export const exceptInvitation = (invitationId: string): Promise<GroupModel> =>
  httpApi.get(`invite/accepted/${invitationId}`).then(({ data }) => data);

export const setCoOwner = (user: UserModel, group: GroupModel): Promise<undefined> =>
  httpApi.post('groups/set-coowner', { userId: user.id, groupId: group.id }).then(({ data }) => data);

export const setMember = (user: UserModel, group: GroupModel): Promise<undefined> =>
  httpApi.post('groups/set-member', { userId: user.id, groupId: group.id }).then(({ data }) => data);

export const removeGroup = (groupId: string): Promise<undefined> =>
  httpApi.delete(`groups/remove-group/${groupId}`).then(({ data }) => data);
