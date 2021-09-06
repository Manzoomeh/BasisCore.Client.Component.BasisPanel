import HttpUtil from "../../HttpUtil";
import IProfileInfo from "../accounting/IProfileInfo";
import IMenuInfo, { IMenuLoaderParam } from "./IMenuInfo";
import Menu from "./Menu";
import MenuMaker from "./MenuMaker";

export default class MenuCache {
  private readonly cache: Map<string, CacheItem>;
  constructor() {
    this.cache = new Map<string, CacheItem>();
  }

  public loadMenuAsync(menuParam: IMenuLoaderParam): Promise<Menu> {
    let cache = this.cache.get(menuParam.type);
    if (!cache) {
      cache = new CacheItem(menuParam);
      this.cache.set(menuParam.type, cache);
    }
    return cache.loadMenuAsync(menuParam);
  }
}

class CacheItem {
  private cache = new Map<number, Menu>();
  private menuMaker: MenuMaker;
  private readonly formatter: (rKey: string, profile: IProfileInfo) => string;
  constructor(menuParam: IMenuLoaderParam) {
    this.menuMaker = new MenuMaker(menuParam.rKey, menuParam.profile);
    this.formatter = new Function(
      "rKey",
      "profile",
      `return \`${menuParam.rawUrl}\``
    ) as any;
  }

  public async loadMenuAsync(menuParam: IMenuLoaderParam): Promise<Menu> {
    let menu = this.cache.get(menuParam.key);
    if (!menu) {
      const menuData = await HttpUtil.getDataAsync<IMenuInfo>(
        this.formatter(menuParam.rKey, menuParam.profile)
      );
      menu = this.menuMaker.create(menuData, menuParam);
      this.cache.set(menuParam.key, menu);
    }
    return menu;
  }
}
