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
      //console.log("qam menu data", menuData);
      moduleCache = await menuMaker.createAsync(menuData, levelUrl);
      levelCache.set(levelId, moduleCache);
    }
    return moduleCache;
  }

  public getModuleInfo(
    level: PanelLevels,
    levelId: number | null,
    moduleId: number
  ): IModuleInfo | null {
    let retVal: IModuleInfo = null;
    const levelCache = this.cache.get(level);
    if (levelCache) {
      const levelItemCache = levelId
        ? levelCache.get(levelId)
        : [...levelCache.values()].find((x) => x.modules.has(moduleId));
      if (levelItemCache) {
        retVal = levelItemCache.modules.get(moduleId);
      }
    }
    return retVal;
  }
}
