import { MenuOwnerType } from "../../type-alias";

export default interface IPageLoader {
  tryLoadPage(
    owner: MenuOwnerType,
    ownerId: string,
    moduleId,
    pageId: string,
    args?: any
  ): boolean;
  tryLoadPageEx(
    owner: MenuOwnerType,
    ownerId: string,
    pageId: string,
    args?: any
  ): boolean;
}
