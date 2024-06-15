import { ILoaderParam } from "../../type-alias";

export default interface IMenuInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuItemInfo {
  title: string;
  mid: string;
}

export interface IMenuExternalItemInfo extends IMenuItemInfo {
  multi: boolean;
  url: string;
  mid: string;
  name: string;
}

export interface IMenuLevelInfo extends IMenuItemInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuPageInfo extends IMenuItemInfo {
  pid: string;
}

export interface IMenuLoaderParam extends ILoaderParam {
  menuMethod: string;
  pageId?: string;
  module?: string;
}
