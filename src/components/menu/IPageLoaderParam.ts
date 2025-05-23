import { PageId, PanelLevels } from "../../type-alias";

export default interface IPageLoaderParam {
  level: PanelLevels;
  levelId: number;
  moduleId: number;
  moduleName: string;
  moduleUrl: string;
  rKey: string;
  pageId: PageId;
  arguments?: any;
  dashboard?: boolean;
  isSilent: boolean;
}
