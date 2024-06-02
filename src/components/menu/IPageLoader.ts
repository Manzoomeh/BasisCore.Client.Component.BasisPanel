import { MenuOwnerType } from "../../type-alias";

export default interface IPageLoader {
  tryLoadPage(pageId: string, args?: any): boolean;
  tryLoadPageEx(
    owner: MenuOwnerType,
    ownerId: number,
    pageId: string,
    args?: any
  ): boolean;
}
