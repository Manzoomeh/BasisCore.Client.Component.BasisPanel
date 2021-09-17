import HttpUtil from "../../HttpUtil";
import IMenuInfo, { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import MenuElementMaker from "./MenuElementMaker";

export default class MenuCacheManager {
  private readonly cache: Map<string, MenuCacheItem>;
  constructor() {
    this.cache = new Map<string, MenuCacheItem>();
  }

  public loadMenuAsync(
    menuParam: IMenuLoaderParam,
    onMenuItemClick: (
      pageId: string,
      param: IMenuLoaderParam,
      target: EventTarget
    ) => void
  ): Promise<MenuElement> {
    let cache = this.cache.get(menuParam.owner);
    if (!cache) {
      cache = new MenuCacheItem(menuParam, onMenuItemClick);
      this.cache.set(menuParam.owner, cache);
    }
    return cache.loadMenuAsync(menuParam);
  }
}

class MenuCacheItem {
  private cache = new Map<string, MenuElement>();
  private menuMaker: MenuElementMaker;
  constructor(
    menuParam: IMenuLoaderParam,
    onMenuItemClick: (
      pageId: string,
      param: IMenuLoaderParam,
      target: EventTarget
    ) => void
  ) {
    this.menuMaker = new MenuElementMaker(menuParam.rKey, onMenuItemClick);
  }

  public async loadMenuAsync(
    menuParam: IMenuLoaderParam
  ): Promise<MenuElement> {
    let menu = this.cache.get(menuParam.ownerId);
    if (!menu) {
      const url = HttpUtil.formatString(
        `${menuParam.ownerUrl}${menuParam.menuMethod}`,
        {
          rKey: menuParam.rKey,
        }
      );
      const menuData = await HttpUtil.getDataAsync<IMenuInfo>(url);
      menu = this.menuMaker.create(menuData, menuParam);
      this.cache.set(menuParam.ownerId, menu);
    }
    return menu;
  }
}
