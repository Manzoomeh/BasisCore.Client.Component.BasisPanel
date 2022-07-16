import IPageLoaderParam from "./components/menu/IPageLoaderParam";
import { MenuOwnerType } from "./type-alias";

export default class LocalStorageUtil {
  private static _lastBusiness: number;
  private static _lastCorporate: number;
  private static _lastPage: IPageLoaderParam;

  private static _currentBusiness: number;
  private static _currentCorporate: number;
  private static _currentPage: IPageLoaderParam;

  private static _hasPageToShow: boolean = false;

  public static loadLastState() {
    const str = localStorage.getItem("__bc_panel_last_state__");
    if (str) {
      const obj = JSON.parse(str);
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
    }
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
    var obj = {
      b: LocalStorageUtil._currentBusiness,
      c: LocalStorageUtil._currentCorporate,
      p: LocalStorageUtil._currentPage,
    };
    localStorage.setItem("__bc_panel_last_state__", JSON.stringify(obj));
  }

  public static getEntitySelectorLastValue(ownerType: MenuOwnerType): number {
    var retVal: number = null;
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
}
