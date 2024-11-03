import IPageLoaderParam from "./components/menu/IPageLoaderParam";
import HttpUtil from "./HttpUtil";
import { MenuOwnerType, PanelLevels } from "./type-alias";
import { IMenuPageInfo } from "./components/menu/IMenuInfo";
import { IPageGroupInfo } from "./components/page/IPageGroupInfo";

export default class LocalStorageUtil {
  static readonly CURRENT_VERSION: number = 1;
  private static _lastBusiness: number;
  private static _lastCorporate: number;
  private static _lastPage: IPageLoaderParam;
  private static _lastMenu: ICurrentMenu;

  private static _currentBusiness: number;
  private static _currentCorporate: number;
  private static _currentPage: IPageLoaderParam;
  private static _currentUserId: number;
  private static _lastBanner: IBannerInfo;

  private static _hasPageToShow: boolean = false;
  private static _hasMenuToActive: boolean = false;
  public static checkRkeyResult: Promise<ICheckRkeyResult>;

  public static async loadLastStateAsync(rKey: string, checkRKeyUrl: string) {
    const url = HttpUtil.formatString(checkRKeyUrl, { rKey: rKey });
    this.checkRkeyResult = HttpUtil.fetchDataAsync<ICheckRkeyResult>(
      url,
      "GET"
    );
    const result = await this.checkRkeyResult;
    if (result.checked) {
      LocalStorageUtil._currentUserId = result.userid;
      const str = localStorage.getItem("__bc_panel_last_state__");
      this._lastBanner = JSON.parse(localStorage.getItem("banner"));
      if (str) {
        try {
          const obj: IStorageObject = JSON.parse(str);
          if (obj.ver == LocalStorageUtil.CURRENT_VERSION) {
            if (obj.i && result.userid == obj.i) {
              if (obj.b) {
                LocalStorageUtil._lastBusiness = obj.b;
              }
              if (obj.c) {
                LocalStorageUtil._lastCorporate = obj.c;
              }
              if (obj.p) {
                LocalStorageUtil._lastPage = obj.p;
                LocalStorageUtil._hasPageToShow = true;
              }
              if (obj.m) {
                LocalStorageUtil._lastMenu = obj.m;
                LocalStorageUtil._hasMenuToActive = true;
              }
            }
          }
        } catch (ex) {
          console.error("error in  load local storage data", ex);
        }
      }
    }
  }

  public static resetCurrentUserId() {
    LocalStorageUtil._currentBusiness = null;
    LocalStorageUtil._currentCorporate = null;
    LocalStorageUtil.save();
  }

  public static setEntitySelectorCurrentValue(
    ownerType: MenuOwnerType,
    value: number
  ) {
    if (ownerType == "business") {
      LocalStorageUtil._currentBusiness = value;
    } else if (ownerType == "corporate") {
      LocalStorageUtil._currentCorporate = value;
      LocalStorageUtil._currentBusiness = null;
    }
    LocalStorageUtil.save();
  }

  private static save(): void {
    const obj: IStorageObject = {
      ver: LocalStorageUtil.CURRENT_VERSION,
      i: LocalStorageUtil._currentUserId,
      b: LocalStorageUtil._currentBusiness,
      c: LocalStorageUtil._currentCorporate,
      p: LocalStorageUtil._currentPage,
      m: LocalStorageUtil._lastMenu,
    };
    localStorage.setItem("__bc_panel_last_state__", JSON.stringify(obj));
  }

  public static getEntitySelectorLastValue(ownerType: MenuOwnerType): number {
    let retVal: number = null;
    if (ownerType == "business") {
      retVal = LocalStorageUtil._lastBusiness;
    } else if (ownerType == "corporate") {
      retVal = LocalStorageUtil._lastCorporate;
    }
    return retVal;
  }

  public static setCurrentPage(page: IPageLoaderParam) {
    LocalStorageUtil._currentPage = page;
    LocalStorageUtil.save();
  }

  public static getCurrentPage(): IPageLoaderParam {
    return LocalStorageUtil._lastPage;
  }

  public static get currentLevel(): PanelLevels {
    return LocalStorageUtil.getCurrentPage()?.level ?? "profile";
  }
  public static mustLoadPage(owner: MenuOwnerType) {
    let load = false;
    if (LocalStorageUtil._lastBusiness) {
      if (owner == "business") {
        load = true;
      }
    } else if (LocalStorageUtil._lastCorporate) {
      if (owner == "corporate") {
        load = true;
      }
    } else if (owner == "profile") {
      load = true;
    }
    if (load) {
      LocalStorageUtil._hasPageToShow = false;
    }
    return load;
  }

  public static hasPageToShow() {
    return LocalStorageUtil._hasPageToShow;
  }

  public static getLastBanner() {
    return LocalStorageUtil._lastBanner;
  }
  public static setClosedBanners(widgetId: number) {
    this._lastBanner.closedWidgets.push(widgetId);
    localStorage.setItem("banner", JSON.stringify(this._lastBanner));
  }
  public static setLastBanner(
    rkey: string,
    eventID: string,
    group,
    closedWidgets?
  ) {
    this._lastBanner = {
      closedWidgets: closedWidgets || [],
      eventID: eventID,
      rkey,
      group,
    };
    localStorage.setItem("banner", JSON.stringify(this._lastBanner));
  }

  public static setCurrentMenu(ownerId: string, menu: IMenuPageInfo) {
    LocalStorageUtil._lastMenu = {
      ownerId: ownerId,
      info: menu,
    };
    LocalStorageUtil.save();
  }

  public static getCurrentMenu(): ICurrentMenu {
    return LocalStorageUtil._lastMenu;
  }

  public static mustActiveMenuItem(owner: MenuOwnerType) {
    let load = false;
    if (LocalStorageUtil._lastBusiness) {
      if (owner == "business") {
        load = true;
      }
    } else if (LocalStorageUtil._lastCorporate) {
      if (owner == "corporate") {
        load = true;
      }
    } else if (owner == "profile") {
      load = true;
    }
    if (load) {
      LocalStorageUtil._hasMenuToActive = false;
    }
    return load;
  }

  public static hasMenuToActive() {
    return LocalStorageUtil._hasMenuToActive;
  }
}

interface ICheckRkeyResult {
  checked: boolean;
  userid: number;
  currentOwnerid: number;
  currentDmnid: number;
  ownerid: number;
  dmnid: number;
  rkey: string;
  usercat: string;
}

interface ICurrentMenu {
  ownerId: string;
  info: IMenuPageInfo;
}
interface IBannerInfo {
  rkey: string;
  eventID: string;
  closedWidgets: number[];
  group: IPageGroupInfo;
}

interface IStorageObject {
  ver: number;
  i: number;
  b: number;
  c: number;
  p: IPageLoaderParam;
  m: ICurrentMenu;
}
