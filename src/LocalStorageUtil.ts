import IPageLoaderParam from "./components/menu/IPageLoaderParam";
import HttpUtil from "./HttpUtil";
import { PageId, PanelLevels } from "./type-alias";
import { IMenuPageInfo } from "./components/menu/IMenuInfo";
import { IPageGroupInfo } from "./components/page/IPageGroupInfo";

export default class LocalStorageUtil {
  static readonly CURRENT_VERSION: number = 2;
  private static _level: PanelLevels = "profile";
  private static _pageId: PageId = "default";
  private static _menuPageId?: PageId;
  private static _businessId?: number;
  private static _corporateId?: number;
  private static _moduleId?: number;
  private static _pageArguments?: any;
  private static _pageDashboard?: boolean;
  private static _pageUrl?: string;
  private static _pageUrl?: string;

  public static get level() {
    return LocalStorageUtil._level;
  }
  public static get businessId() {
    return LocalStorageUtil._businessId;
  }
  public static get corporateId() {
    return LocalStorageUtil._corporateId;
  }
  public static get moduleId() {
    return LocalStorageUtil._moduleId;
  }
  public static get pageId() {
    return LocalStorageUtil._pageId;
  }
  public static get menuPageId() {
    return LocalStorageUtil._menuPageId;
  }
  public static get pageArguments() {
    return LocalStorageUtil._pageArguments;
  }
  public static get pageDashboard() {
    return LocalStorageUtil._pageDashboard;
  }
  public static get pageUrl() {
    return LocalStorageUtil._pageUrl;
  }

  public static setLevel(level: PanelLevels, ownerId: number) {
    LocalStorageUtil._level = level;
    switch (level) {
      case "profile": {
        LocalStorageUtil._businessId = null;
        LocalStorageUtil._corporateId = null;
        break;
      }
      case "corporate": {
        LocalStorageUtil._corporateId = ownerId;
        LocalStorageUtil._businessId = null;
        break;
      }
      case "business": {
        LocalStorageUtil._businessId = ownerId;
        break;
      }
    }
    LocalStorageUtil.save();
  }

  public static getLevelValue(level: PanelLevels): number | null {
    let retVal: number = null;
    switch (level) {
      case "profile": {
        retVal = 1;
        break;
      }
      case "corporate": {
        retVal = LocalStorageUtil.corporateId;
        break;
      }
      case "business": {
        retVal = LocalStorageUtil._businessId;
        break;
      }
    }
    return retVal;
  }

  public static setPage(
    moduleId: number,
    pageId: PageId,
    dashboard: boolean,
    args: any
  ) {
    LocalStorageUtil._pageId = pageId;
    LocalStorageUtil._moduleId = moduleId;
    LocalStorageUtil._pageDashboard = dashboard;
    LocalStorageUtil._pageArguments = args;
    LocalStorageUtil.save();
  }

  public static setMenuLastPage(pageId: PageId) {
    LocalStorageUtil._menuPageId = pageId;
    LocalStorageUtil.save();
  }

  public static setPageUrl(pageUrl: string) {
    LocalStorageUtil._pageUrl = pageUrl;
    LocalStorageUtil.save();
  }

  private static _currentUserId: number;
  private static _lastBanner: IBannerInfo;

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
              LocalStorageUtil._level = obj.level ?? "profile";
              LocalStorageUtil._corporateId = obj.corporateId;
              LocalStorageUtil._businessId = obj.businessId;
              LocalStorageUtil._moduleId = obj.moduleId;
              LocalStorageUtil._pageId = obj.pageId ?? "default";
              LocalStorageUtil._pageArguments = obj.pageArguments;
              LocalStorageUtil._pageDashboard = obj.pageDashboard;
              LocalStorageUtil._menuPageId = obj.menuPageId;
              LocalStorageUtil._pageUrl = obj.pageUrl;
            }
          }
        } catch (ex) {
          console.error("error in  load local storage data", ex);
        }
      }
    }
  }

  // public static resetCurrentUserId() {
  //   LocalStorageUtil._currentBusiness = null;
  //   LocalStorageUtil._currentCorporate = null;
  //   LocalStorageUtil.save();
  // }

  // public static setEntitySelectorCurrentValue(
  //   ownerType: MenuOwnerType,
  //   value: number
  // ) {
  //   if (ownerType == "business") {
  //     LocalStorageUtil._currentBusiness = value;
  //   } else if (ownerType == "corporate") {
  //     LocalStorageUtil._currentCorporate = value;
  //     LocalStorageUtil._currentBusiness = null;
  //   }
  //   LocalStorageUtil.save();
  // }

  private static save(): void {
    const obj: IStorageObject = {
      ver: LocalStorageUtil.CURRENT_VERSION,
      i: LocalStorageUtil._currentUserId,
      level: LocalStorageUtil._level,
      corporateId: LocalStorageUtil._corporateId,
      businessId: LocalStorageUtil._businessId,
      moduleId: LocalStorageUtil._moduleId,
      pageId: LocalStorageUtil._pageId,
      menuPageId: LocalStorageUtil._menuPageId,
      pageArguments: LocalStorageUtil._pageArguments,
      pageDashboard: LocalStorageUtil._pageDashboard,
      pageUrl: LocalStorageUtil._pageUrl,
    };
    localStorage.setItem("__bc_panel_last_state__", JSON.stringify(obj));
  }

  // public static getEntitySelectorLastValue(ownerType: MenuOwnerType): number {
  //   let retVal: number = null;
  //   if (ownerType == "business") {
  //     retVal = LocalStorageUtil._lastBusiness;
  //   } else if (ownerType == "corporate") {
  //     retVal = LocalStorageUtil._lastCorporate;
  //   }
  //   return retVal;
  // }

  // public static setCurrentPage(page: IPageLoaderParam) {
  //   LocalStorageUtil._currentPage = page;
  //   LocalStorageUtil.save();
  // }

  // public static getCurrentPage(): IPageLoaderParam {
  //   return null; // LocalStorageUtil._lastPage;
  // }

  // public static get currentLevel(): PanelLevels {
  //   return LocalStorageUtil.getCurrentPage()?.level ?? "profile";
  // }

  // public static mustLoadPage(owner: MenuOwnerType) {
  //   let load = false;
  //   if (LocalStorageUtil._lastBusiness) {
  //     if (owner == "business") {
  //       load = true;
  //     }
  //   } else if (LocalStorageUtil._lastCorporate) {
  //     if (owner == "corporate") {
  //       load = true;
  //     }
  //   } else if (owner == "profile") {
  //     load = true;
  //   }
  //   if (load) {
  //     LocalStorageUtil._hasPageToShow = false;
  //   }
  //   return load;
  // }

  // public static hasPageToShow() {
  //   return LocalStorageUtil._hasPageToShow;
  // }

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

  // public static setCurrentMenu(ownerId: string, menu: IMenuPageInfo) {
  //   LocalStorageUtil._lastMenu = {
  //     ownerId: ownerId,
  //     info: menu,
  //   };
  //   LocalStorageUtil.save();
  // }

  // public static getCurrentMenu(): ICurrentMenu {
  //   return null; // LocalStorageUtil._lastMenu;
  // }

  // public static mustActiveMenuItem(level: PanelLevels) {
  //   let load = false;
  //   if (LocalStorageUtil._lastBusiness) {
  //     if (level == "business") {
  //       load = true;
  //     }
  //   } else if (LocalStorageUtil._lastCorporate) {
  //     if (level == "corporate") {
  //       load = true;
  //     }
  //   } else if (level == "profile") {
  //     load = true;
  //   }
  //   if (load) {
  //     LocalStorageUtil._hasMenuToActive = false;
  //   }
  //   return load;
  // }

  public static hasMenuToActive() {
    return false; //LocalStorageUtil._hasMenuToActive;
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
  level: PanelLevels;
  corporateId?: number;
  businessId?: number;
  moduleId?: number;
  pageId: PageId;
  menuPageId: PageId;
  pageArguments?: any;
  pageDashboard?: boolean;
  pageUrl: string;
}