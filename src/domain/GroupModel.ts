import { UserModel } from './UserModel';
export interface GroupModel {
  name: string;
  owner: UserModel;
  coOwner: UserModel[];
  members: UserModel[];
  id: string;
  inviteCode: string;
  openForJoin: boolean;
}
