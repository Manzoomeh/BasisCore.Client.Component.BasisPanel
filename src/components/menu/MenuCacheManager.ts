import HttpUtil from "../../HttpUtil";
import IProfileInfo from "../accounting/IProfileInfo";
import IBasisPanelOptions from "../basispanel/IBasisPanelOptions";
import IMenuInfo, { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import MenuElementMaker from "./MenuElementMaker";

export default class MenuCacheManager {
  private readonly cache: Map<string, MenuCacheItem>;
  constructor() {
    this.cache = new Map<string, MenuCacheItem>();
  }

  public loadMenuAsync(menuParam: IMenuLoaderParam): Promise<MenuElement> {
    let cache = this.cache.get(menuParam.type);
    if (!cache) {
      cache = new MenuCacheItem(menuParam);
      this.cache.set(menuParam.type, cache);
    }
    return cache.loadMenuAsync(menuParam);
  }
}

class MenuCacheItem {
  private cache = new Map<number, MenuElement>();
  private menuMaker: MenuElementMaker;
  constructor(menuParam: IMenuLoaderParam) {
    this.menuMaker = new MenuElementMaker(menuParam.rKey, menuParam.profile);
  }

  public async loadMenuAsync(
    menuParam: IMenuLoaderParam
  ): Promise<MenuElement> {
    let menu = this.cache.get(menuParam.key);
    if (!menu) {
      const url = HttpUtil.formatString(menuParam.rawUrl, {
        rKey: menuParam.rKey,
      });
      const menuData = await HttpUtil.getDataAsync<IMenuInfo>(url);
      menu = this.menuMaker.create(menuData, menuParam);
      this.cache.set(menuParam.key, menu);
    }
    return menu;
  }
}
