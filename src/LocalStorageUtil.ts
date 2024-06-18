import HttpUtil from "./HttpUtil";
import { IRoutingQueryString, MenuOwnerType } from "./type-alias";
import { IMenuLoaderParam, IMenuPageInfo } from "./components/menu/IMenuInfo";

export default class LocalStorageUtil {
  public static UserId: number;
  public static BusinessId?: number;
  public static CorporateId?: number;
  public static PageId?: string;
  public static ModuleId?: string;
  public static ModuleName?: string;
  public static Category?: MenuOwnerType;
  public static Version: string = "1.0.0.0";
  static KEY: string = "__bc_panel_last_state__";

  public static async loadLastStateAsync(rKey: string, checkRKeyUrl: string) {
    const url = HttpUtil.formatString(checkRKeyUrl, { rKey: rKey });
    const result = await HttpUtil.fetchDataAsync<ICheckRkeyResult>(url, "GET");
    if (result.checked) {
      LocalStorageUtil.UserId = result.userid;
      const routingQueryObject =
        HttpUtil.getQueryStringObject() as IRoutingQueryString;
      if (
        routingQueryObject &&
        routingQueryObject.category &&
        routingQueryObject.pageId
      ) {
        LocalStorageUtil.Category = routingQueryObject.category;
        LocalStorageUtil.PageId = routingQueryObject.pageId;
        LocalStorageUtil.ModuleId = routingQueryObject.moduleId;
        LocalStorageUtil.ModuleName = routingQueryObject.moduleName;
        switch (LocalStorageUtil.Category) {
          case "profile": {
            LocalStorageUtil.CorporateId = null;
            LocalStorageUtil.BusinessId = null;
            break;
          }
          case "corporate": {
            LocalStorageUtil.CorporateId = result.currentOwnerid;
            LocalStorageUtil.BusinessId = null;
            break;
          }
          case "business": {
            LocalStorageUtil.CorporateId = result.currentOwnerid;
            LocalStorageUtil.BusinessId = result.currentDmnid;
            break;
          }
        }
      } else {
        const str = localStorage.getItem(LocalStorageUtil.KEY);
        if (str) {
          try {
            const obj: IStateModel = JSON.parse(str);
            if (obj.Version === LocalStorageUtil.Version) {
              LocalStorageUtil.CorporateId = obj.CorporateId ?? null;
              LocalStorageUtil.BusinessId = obj.BusinessId ?? null;
              LocalStorageUtil.Category = obj.Category ?? "profile";
              LocalStorageUtil.PageId = obj.PageId ?? "default";
              LocalStorageUtil.ModuleId = obj.ModuleId ?? null;
              LocalStorageUtil.ModuleName = obj.ModuleName ?? null;
            } else {
              localStorage.removeItem(LocalStorageUtil.KEY);
              console.log(
                "Old version of basis panel setting detect in local storage and removed.",
                obj
              );
            }
          } catch (ex) {
            console.error("error in  load local storage data", ex);
          }
        }
      }
    }
  }

  public static resetCurrentUserId() {
    LocalStorageUtil.BusinessId = null;
    LocalStorageUtil.CorporateId = null;
    LocalStorageUtil.save();
  }

  public static setEntitySelectorCurrentValue(
    ownerType: MenuOwnerType,
    id: number
  ) {
    if (ownerType == "business") {
      LocalStorageUtil.BusinessId = id;
    } else if (ownerType == "corporate") {
      LocalStorageUtil.CorporateId = id;
      LocalStorageUtil.BusinessId = null;
    }
    LocalStorageUtil.save();
  }

  private static save(): void {
    localStorage.setItem(
      LocalStorageUtil.KEY,
      JSON.stringify(LocalStorageUtil.getLastState())
    );
  }

  public static getLastState(): IStateModel {
    return {
      UserId: LocalStorageUtil.UserId,
      BusinessId: LocalStorageUtil.BusinessId,
      CorporateId: LocalStorageUtil.CorporateId,
      PageId: LocalStorageUtil.PageId,
      Category: LocalStorageUtil.Category,
      ModuleId: LocalStorageUtil.ModuleId,
      ModuleName: LocalStorageUtil.ModuleName,
      Version: LocalStorageUtil.Version,
    };
  }

  public static setCurrentState(state: IStateModel): void {
    LocalStorageUtil.UserId = state.UserId;
    LocalStorageUtil.BusinessId = state.BusinessId;
    LocalStorageUtil.CorporateId = state.CorporateId;
    LocalStorageUtil.PageId = state.PageId;
    LocalStorageUtil.Category = state.Category;
    LocalStorageUtil.ModuleId = state.ModuleId;
    LocalStorageUtil.ModuleName = state.ModuleName;
    LocalStorageUtil.save();
  }

  public static getEntitySelectorLastValue(ownerType: MenuOwnerType): number {
    let retVal: number = null;
    if (ownerType == "business") {
      retVal = LocalStorageUtil.BusinessId;
    } else if (ownerType == "corporate") {
      retVal = LocalStorageUtil.CorporateId;
    }
    return retVal;
  }

  public static setCurrentPage(
    moduleName: string,
    moduleId: string,
    pageId: string,
    category: MenuOwnerType
  ) {
    LocalStorageUtil.PageId = pageId;
    LocalStorageUtil.Category = category;
    LocalStorageUtil.ModuleId = moduleId;
    LocalStorageUtil.ModuleName = moduleName;
    LocalStorageUtil.save();
  }
}

interface ICheckRkeyResult {
  checked: boolean;
  userid: number;
  /*current corporate*/
  currentOwnerid: number;
  /*current business*/
  currentDmnid: number;
  ownerid: number;
  dmnid: number;
  rkey: string;
  usercat: string;
  ERP: boolean;
}

export interface ICurrentMenu {
  menu: IMenuLoaderParam;
  pageId: string;
  ownerId: string;
  info: IMenuPageInfo;
}

export interface IStateModel {
  UserId: number;
  BusinessId?: number;
  CorporateId?: number;
  PageId: string;
  Category?: MenuOwnerType;
  ModuleId?: string;
  ModuleName?: string;
  Version?: string;
}
