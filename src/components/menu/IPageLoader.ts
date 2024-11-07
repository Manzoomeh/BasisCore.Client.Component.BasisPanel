import { MenuOwnerType } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";

export default interface IPageLoader {
  tryLoadPage(pageId: string, args?: any): Promise<boolean>;
  tryLoadPageEx(
    owner: MenuOwnerType,
    moduleId: string,
    pageId: string,
    args?: any
  ): Promise<boolean>;
}
