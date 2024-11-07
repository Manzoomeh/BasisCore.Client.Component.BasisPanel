import HttpUtil from "../../HttpUtil";
import IMenuInfo from "./IMenuInfo";
import MenuElement from "./MenuElement";
import MenuElementMaker from "./MenuElementMaker";
import { ICheckRkeyOptions } from "./../basispanel/IBasisPanelOptions";
import {
  IModuleInfo,
  menuItemClickCallback,
  PanelLevels,
} from "../../type-alias";

export default class MenuCacheManager {
  private readonly cache: Map<PanelLevels, Map<number, MenuElement>> = new Map<
    PanelLevels,
    Map<number, MenuElement>
  >();
  private readonly checkRkeyOption: ICheckRkeyOptions;
  private readonly deviceId: number;
  private readonly rKey: string;
  private readonly menuMethod: string;
  private readonly onMenuItemClick: menuItemClickCallback;
  constructor(
    rKey: string,
    menuMethod: string,
    checkRkey: ICheckRkeyOptions,
    deviceId: number,
    onMenuItemClick: menuItemClickCallback
  ) {
    this.checkRkeyOption = checkRkey;
    this.deviceId = deviceId;
    this.rKey = rKey;
    this.menuMethod = menuMethod;
    this.onMenuItemClick = onMenuItemClick;
  }

  public async loadMenuAsync(
    level: PanelLevels,
    levelId: number,
    levelUrl: string
  ): Promise<MenuElement> {
    let levelCache = this.cache.get(level);
    if (!levelCache) {
      levelCache = new Map<number, MenuElement>();
      this.cache.set(level, levelCache);
    }
    let moduleCache = levelCache.get(levelId);
    if (!moduleCache) {
      const menuMaker = new MenuElementMaker(
        level,
        levelId,
        this.rKey,
        this.menuMethod,
        this.onMenuItemClick,
        this.checkRkeyOption,
        this.deviceId
      );
      const url = HttpUtil.formatString(`${levelUrl}${this.menuMethod}`, {
        rKey: this.rKey,
        level: level,
      });
      const menuData = await HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
        url,
        "GET",
        this.checkRkeyOption
      );
      console.log("qam menu data", menuData);
      moduleCache = await menuMaker.createAsync(menuData, levelUrl);
      levelCache.set(levelId, moduleCache);
    }
    return moduleCache;
  }

  public getModuleInfo(
    level: PanelLevels,
    levelId: number,
    moduleId: number
  ): IModuleInfo | null {
    let retVal: IModuleInfo = null;
    const levelCache = this.cache.get(level);
    if (levelCache) {
      const levelItemCache = levelCache.get(levelId);
      if (levelItemCache) {
        retVal = levelItemCache.modules.get(moduleId);
      }
    }
    return retVal;
  }
}

// class MenuCacheItem {
//   private cache = new Map<number, MenuElement>();
//   private menuMaker: MenuElementMaker;
//   private checkRkeyOption: ICheckRkeyOptions;
//   constructor(
//     //menuParam: IMenuLoaderParam,
//     level: PanelLevels,
//     ownerId: number,
//     ownerUrl: string,
//     rKey: string,
//     menuMethod: string,
//     moduleMapper: Map<number, IModuleInfo>,
//     onMenuItemClick: (
//       level: PanelLevels,
//       moduleId: number,
//       pageId: number,
//       target: EventTarget
//     ) => void,
//     checkRkey: ICheckRkeyOptions,
//     deviceId: number
//   ) {
//     this.menuMaker = new MenuElementMaker(
//       level,
//       rKey,
//       menuMethod,
//       moduleMapper,
//       onMenuItemClick,
//       checkRkey,
//       deviceId
//     );
//     this.checkRkeyOption = checkRkey;
//   }

//   public async loadMenuAsync(
//     ownerId: number,
//     ownerUrl: string
//   ): Promise<MenuElement> {
//     let menu = this.cache.get(ownerId);
//     if (!menu) {
//       const url = HttpUtil.formatString(`${ownerUrl}${menuMethod}`, {
//         rKey: rKey,
//         level: level,
//       });
//       //const menuData = await HttpUtil.getDataAsync<IMenuInfo>(url);
//       const menuData = await HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
//         url,
//         "GET",
//         this.checkRkeyOption
//       );
//       console.log("qam menu data", menuData);
//       menu = this.menuMaker.create(menuData, level, ownerId, ownerUrl);
//       this.cache.set(ownerId, menu);
//     }
//     return menu;
//   }
// }
