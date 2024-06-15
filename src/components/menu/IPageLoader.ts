import { MenuOwnerType } from "../../type-alias";

export default interface IPageLoader {
  tryLoadPage(ownerId: string, pageId: string, args?: any): boolean;
  tryLoadPageEx(
    owner: MenuOwnerType,
    ownerId: string,
    pageId: string,
    args?: any
  ): boolean;
}
