import HttpUtil from "./HttpUtil";
import { PageId, PanelLevels } from "./type-alias";
import { IPageGroupInfo } from "./components/page/IPageGroupInfo";
import IStateModel from "./components/menu/IStateModel";

export default class LocalStorageUtil {
  static readonly CURRENT_VERSION: number = 2;
  private static _level: PanelLevels = "profile";
  private static _pageId: PageId = "default";
  private static _menuPageId?: PageId;
  private static _businessId?: number;
  private static _corporateId?: number;
  private static _moduleId?: number;
  private static _moduleName?: string;
  private static _pageArguments?: any;
  private static _pageDashboard?: boolean;

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
  public static get moduleName() {
    return LocalStorageUtil._moduleName;
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

  private static _currentUserId: number;
  private static _lastBanner: IBannerInfo;
  private static _announceLS : IAnnounceInfo;
  public static checkRkeyResult: ICheckRkeyResult;

  public static async loadLastStateAsync(
    rKey: string,
    checkRKeyUrl: string,
    urlPrefix: string
  ) {
    let urlBaseLevel: PanelLevels;
    let urlBaseModuleName: string;
    let urlBasePageId: PageId;
    const parts = window.location.pathname
      .replace(urlPrefix, "")
      .substring(1)
      .split("/");
    if (parts.length > 1) {
      urlBaseLevel = <PanelLevels>parts[0]?.toLocaleLowerCase();
      if (parts.length == 3) {
        urlBaseModuleName = parts[1];
        urlBasePageId = parseInt(parts[2]) || "default";
      } else {
        urlBaseModuleName = null;
        urlBasePageId = parseInt(parts[1]) || "default";
      }
    }

    const url = HttpUtil.formatString(checkRKeyUrl, { rKey: rKey });
    LocalStorageUtil.checkRkeyResult =
      await HttpUtil.fetchDataAsync<ICheckRkeyResult>(url, "GET");
    if (LocalStorageUtil.checkRkeyResult.checked) {
      LocalStorageUtil._currentUserId = LocalStorageUtil.checkRkeyResult.userid;
      const str = localStorage.getItem("__bc_panel_last_state__");
      LocalStorageUtil._lastBanner = JSON.parse(localStorage.getItem("banner"));

      if (str) {
        try {
          const obj: IStorageObject = JSON.parse(str);
          if (obj.ver == LocalStorageUtil.CURRENT_VERSION) {
            if (obj.i && LocalStorageUtil._currentUserId == obj.i) {
              LocalStorageUtil._level = obj.level ?? "profile";
              LocalStorageUtil._corporateId = obj.corporateId;
              LocalStorageUtil._businessId = obj.businessId;
              LocalStorageUtil._moduleId = obj.moduleId;
              LocalStorageUtil._pageId = obj.pageId ?? "default";
              LocalStorageUtil._pageArguments = obj.pageArguments;
              LocalStorageUtil._pageDashboard = obj.pageDashboard;
              LocalStorageUtil._menuPageId = obj.menuPageId;
            }
          }
          if (urlBasePageId) {
            LocalStorageUtil._pageId = urlBasePageId;
            LocalStorageUtil._moduleName = urlBaseModuleName;
            LocalStorageUtil._level = urlBaseLevel;
            LocalStorageUtil._businessId =
              LocalStorageUtil.checkRkeyResult.currentDmnid;
            LocalStorageUtil._corporateId =
              LocalStorageUtil.checkRkeyResult.currentOwnerid;
            LocalStorageUtil.save();
          }
        } catch (ex) {
          console.error("error in  load local storage data", ex);
        }
      }
    }
  }

  public static async setLastState(state: IStateModel) {
    LocalStorageUtil._level = state.level;
    LocalStorageUtil._corporateId = state.corporateId;
    LocalStorageUtil._businessId = state.businessId;
    LocalStorageUtil._moduleId = state.moduleId;
    LocalStorageUtil._pageId = state.pageId ?? "default";
    LocalStorageUtil._pageArguments = state.arguments;
    LocalStorageUtil._pageDashboard = null;
    LocalStorageUtil._menuPageId = state.menuPageId;
    LocalStorageUtil.save();
  }

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
    };
    localStorage.setItem("__bc_panel_last_state__", JSON.stringify(obj));
  }

  public static getLastBanner() {
    return LocalStorageUtil._lastBanner;
  }
  public static getLastAnnounce() {
    
    LocalStorageUtil._announceLS = JSON.parse(localStorage.getItem("announce"));
    return LocalStorageUtil._announceLS;
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

  public static setAnnounce(
    rkey: string,
    text: string,
    link : string
  ) {
    this._announceLS = {
      rkey,
      text,
      link
      
    };
    localStorage.setItem("announce", JSON.stringify(this._announceLS));
  }

  public static announceSeen(
    seen : boolean
  ) {
    const lastAnnounce : IAnnounceInfo = this.getLastAnnounce()
    lastAnnounce.seen = seen
    localStorage.setItem("announce", JSON.stringify(lastAnnounce));
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

interface IBannerInfo {
  rkey: string;
  eventID: string;
  closedWidgets: number[];
  group: IPageGroupInfo;
}

interface IAnnounceInfo {
  rkey: string;
  text: string;
  link: string;
  seen? : boolean
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
}
