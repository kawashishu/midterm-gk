import { GroupModel } from './GroupModel';
import { UserModel } from './UserModel';
export interface PresentationModel {
  name: string;
  owner: UserModel;
  id: string;
  code: string;
  slices: SlideModel[];
  group?: GroupModel;
  isShowing: boolean;
  isShowInGroup: boolean;
}

export interface SlideModel {
  id: string;
  type: SliceType;
  heading?: string;
  subheading?: string;
  content?: string;
  options?: OptionModel[];
  answers: AnswerModal[];
}

export enum SliceType {
  MULTIPLE_CHOICE = 'multipleChoice',
  HEADING = 'heading',
  PARAGRAGH = 'paragraph',
}

export interface OptionModel {
  id: number;
  name: string;
  count: number;
}

export interface AnswerModal {
  user: UserModel;
  answer: string;
  createAt: string;
  _id: string;
}
