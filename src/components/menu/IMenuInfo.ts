import { ILoaderParam, PageId, PanelLevels } from "../../type-alias";

export default interface IMenuInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuItemInfo {
  title: string;
  mid: number;
}

export interface IMenuExternalItemInfo extends IMenuItemInfo {
  multi: boolean;
  name: string;
  url: string;
}

export interface IMenuLevelInfo extends IMenuItemInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuPageInfo extends IMenuItemInfo {
  pid: number;
}

export interface IMenuLoaderParam {
  level: PanelLevels;
  levelId: number;
  levelUrl: string;
  moduleId?: number;
  moduleName?: string;
  pageId?: PageId;
  pageArg?: any;
}
