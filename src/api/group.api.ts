import { httpApi } from "./http.api";


export const createGroup = (name: string): Promise<undefined> =>
httpApi.post<undefined>('groups/create-group/', { name } ).then(({ data }) => data);