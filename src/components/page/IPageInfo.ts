import { IPageGroupInfo } from "./IPageGroupInfo";

export default interface IPageInfo {
  groups: Array<IPageGroupInfo>;
  content?: string;
  container?: string;
  customizable?: boolean;
}
