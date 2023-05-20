import HttpUtil from "../../HttpUtil";
import IMenuInfo, { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import MenuElementMaker from "./MenuElementMaker";
import { ICheckRkeyOptions } from "./../basispanel/IBasisPanelOptions";
import { MenuOwnerType } from "../../type-alias";

export default class MenuCacheManager {
  private readonly cache: Map<string, MenuCacheItem>;
  private checkRkeyOption: ICheckRkeyOptions;
  private deviceId: number;
  constructor(checkRkey: ICheckRkeyOptions, deviceId: number) {
    this.cache = new Map<string, MenuCacheItem>();
    this.checkRkeyOption = checkRkey;
    this.deviceId = deviceId;
  }

  public tryGetMenu(category: MenuOwnerType, ownerId: string): MenuElement {
    let cache = this.cache.get(category);
    return cache?.tryGetMenu(ownerId);
  }

  public loadMenuAsync(
    menuParam: IMenuLoaderParam,
    onMenuItemClick: (pageId: string) => void
  ): Promise<MenuElement> {
    let cache = this.cache.get(menuParam.owner);
    if (!cache) {
      cache = new MenuCacheItem(
        menuParam,
        onMenuItemClick,
        this.checkRkeyOption,
        this.deviceId
      );
      this.cache.set(menuParam.owner, cache);
    }
    return cache.loadMenuAsync(menuParam);
  }
}

class MenuCacheItem {
  private cache = new Map<string, MenuElement>();
  private menuMaker: MenuElementMaker;
  private checkRkeyOption: ICheckRkeyOptions;
  constructor(
    menuParam: IMenuLoaderParam,
    onMenuItemClick: (pageId: string) => void,
    checkRkey: ICheckRkeyOptions,
    deviceId: number
  ) {
    this.menuMaker = new MenuElementMaker(
      menuParam.rKey,
      onMenuItemClick,
      checkRkey,
      deviceId
    );
    this.checkRkeyOption = checkRkey;
  }

  public tryGetMenu(ownerId: string): MenuElement {
    return this.cache.get(ownerId);
  }

  public async loadMenuAsync(
    menuParam: IMenuLoaderParam
  ): Promise<MenuElement> {
    let menu = this.tryGetMenu(menuParam.ownerId);
    if (!menu) {
      const url = HttpUtil.formatString(
        `${menuParam.ownerUrl}${menuParam.menuMethod}`,
        {
          rKey: menuParam.rKey,
          level: menuParam.owner,
        }
      );
      const menuData = await HttpUtil.checkRKeyFetchDataAsync<IMenuInfo>(
        url,
        "GET",
        this.checkRkeyOption
      );
      menu = this.menuMaker.create(menuData, menuParam);
      this.cache.set(menuParam.ownerId, menu);
    }
    return menu;
  }
}
