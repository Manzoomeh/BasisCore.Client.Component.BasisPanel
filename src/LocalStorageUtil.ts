import { SourceId } from "basiscore";
import IPageLoaderParam from "./components/menu/IPageLoaderParam";
import { DefaultSource, MenuOwnerType } from "./type-alias";

export default class LocalStorageUtil {
  private static _lastBusiness: number;
  private static _lastCorporate: number;
  private static _lastPage: IPageLoaderParam;

  private static _currentBusiness: number;
  private static _currentCorporate: number;
  private static _currentPage: IPageLoaderParam;

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
      }
      console.log("local-load", obj);
    }
  }

  public static setEntitySelectorCurrentValue(
    ownerType: MenuOwnerType,
    value: number
  ) {
    console.log("local-set", ownerType, value);
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
    console.log("local-save", obj);
    localStorage.setItem("__bc_panel_last_state__", JSON.stringify(obj));
  }

  public static getEntitySelectorLastValue(ownerType: MenuOwnerType): number {
    var retVal: number = null;
    if (ownerType == "business") {
      retVal = LocalStorageUtil._lastBusiness;
    } else if (ownerType == "corporate") {
      retVal = LocalStorageUtil._lastCorporate;
    }
    console.log("local-get", ownerType, retVal);
    return retVal;
  }

  public static setCurrentPage(page: IPageLoaderParam) {
    console.log("local-set", page);
    LocalStorageUtil._currentPage = page;
    LocalStorageUtil.save();
  }

  public static getCurrentPage(): IPageLoaderParam {
    return LocalStorageUtil._lastPage;
  }

  public static mustLoadPage(sourceId: SourceId) {
    let wait = false;
    if (LocalStorageUtil._currentCorporate) {
      if (sourceId == DefaultSource.CORPORATE_SOURCE) {
        wait = true;
      }
    } else if (LocalStorageUtil._currentBusiness) {
      if (sourceId == DefaultSource.BUSINESS_SOURCE) {
        wait = true;
      }
    } else if (sourceId == DefaultSource.USER_INFO_SOURCE) {
      wait = true;
    }
    console.log("local-wait", wait);
    return wait;
  }
}
