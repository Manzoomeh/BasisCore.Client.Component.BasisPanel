import { IDictionary } from "../../type-alias";
import IProfileInfo from "../accounting/IProfileInfo";

export default interface IMenuInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuItemInfo {
  title: string;
}

export interface IMenuExternalItemInfo extends IMenuItemInfo {
  multi: boolean;
  url: string;
  mid: number;
}

export interface IMenuLevelInfo extends IMenuItemInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuPageInfo extends IMenuItemInfo {
  pid: number;
}

export interface IMenuLoaderParam {
  type: string;
  key: number;
  profile: IProfileInfo;
  rawUrl: string;
  rKey: string;
  extra?: IDictionary<string>;
  menuMethod: string;
}
