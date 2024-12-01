import { IModuleInfo, PageId, PanelLevels } from "../../type-alias";
export default interface IPageLoader {
  tryLoadPage(
    level: PanelLevels,
    levelId: number | null,
    moduleId: number,
    pageId: PageId,
    isSilent: boolean,
    args: any | null
  ): Promise<boolean>;

  tryLoadPageEx(
    level: PanelLevels,
    moduleId: number,
    pageId: PageId,
    args?: any
  ): Promise<boolean>;

  getModuleInfo(
    level: PanelLevels,
    levelId: number,
    moduleId: number
  ): IModuleInfo;
}
