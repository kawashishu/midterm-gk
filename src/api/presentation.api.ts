import { PresentationModel } from '@app/domain/PresentationModel';
import { UserModel } from '@app/domain/UserModel';
import { httpApi } from './http.api';

export const createPresentation = (name: string) =>
  httpApi.post<undefined>('presentations', { name }).then(({ data }) => data);

export const getPresentation = () => httpApi.get<PresentationModel[]>('presentations').then(({ data }) => data);

export const getPresentationById = (id: string) =>
  httpApi.get<PresentationModel>(`presentations/${id}`).then(({ data }) => data);

export const showPresentation = (id: string) =>
  httpApi.get<undefined>(`presentations/${id}/show`).then(({ data }) => data);

export const showPresentationInGroup = (id: string, groupId: string) =>
  httpApi.post<undefined>(`presentations/${id}/show-in-group`, { groupId }).then(({ data }) => data);

export const joinPresentation = (code: string) =>
  httpApi.get<undefined>(`presentations/join/${code}`).then(({ data }) => data);

export const deletePresentation = (id: string) =>
  httpApi.delete<undefined>(`presentations/${id}`).then(({ data }) => data);

export const addSlice = (id: string) => httpApi.post<undefined>(`presentations/${id}/add`).then(({ data }) => data);

export const deleteSlice = (id: string, sliceId: string) =>
  httpApi.delete<undefined>(`presentations/${id}/remove/${sliceId}`).then(({ data }) => data);

export const updateSlice = (id: string, sliceId: string, data: any) =>
  httpApi.put<undefined>(`presentations/${id}/update/${sliceId}`, data).then(({ data }) => data);

export const getCollaborators = (id: string) =>
  httpApi.get<UserModel[]>(`presentations/${id}/collaborators`).then(({ data }) => data);

export const addMultiCollaborators = (id: string, ids: string[]) =>
  httpApi
    .post<UserModel[]>(`presentations/${id}/collaborators/add-multi`, { collaboratorIds: ids })
    .then(({ data }) => data);

export const removeCollaborator = (id: string, collaboratorId: string) =>
  httpApi.delete<UserModel[]>(`presentations/${id}/collaborators/remove/${collaboratorId}`).then(({ data }) => data);
