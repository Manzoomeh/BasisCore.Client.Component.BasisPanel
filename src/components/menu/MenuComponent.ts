import { ISource, IUserDefineComponent, IDependencyContainer } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { DefaultSource, MenuOwnerType } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";
import { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import IPageLoaderParam from "./IPageLoaderParam";
import IPageLoader from "./IPageLoader";
import { IStateModel } from "../../LocalStorageUtil";

export default class MenuComponent
  extends BasisPanelChildComponent
  implements IPageLoader
{
  readonly ul: HTMLUListElement;
  private cache: MenuCacheManager;
  private current?: MenuElement;
  private _isSilent: boolean = false;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-menu-container");
    this.ul = this.container.querySelector("[data-bc-menu]");
    this.cache = new MenuCacheManager(
      this.options.checkRkey,
      this.deviceId as number
    );
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([
      DefaultSource.SHOW_MENU,
      DefaultSource.SET_MENU,
      DefaultSource.LOAD_MENU,
    ]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    console.log("qam menu runasync", source?.id, source?.rows[0]);
    switch (source?.id) {
      case DefaultSource.LOAD_MENU:
      case DefaultSource.SHOW_MENU: {
        const menuParam: IMenuLoaderParam = source.rows[0];
        await this.loadDataAsync(
          menuParam,
          source?.id === DefaultSource.SHOW_MENU
        );
        if (menuParam.pageId) {
          this.tryLoadPage(
            menuParam.ownerId.toString(),
            menuParam.pageId.toString(),
            null
          );
        }
        break;
      }
      case DefaultSource.SET_MENU: {
        this._isSilent = true;
        const model: IStateModel = source.rows[0];
        const ownerId = model.ModuleId
          ? model.ModuleId
          : model.Category === "profile"
          ? 0
          : model.Category === "business"
          ? model.BusinessId
          : model.CorporateId;
        this.tryLoadPageEx(
          model.Category,
          ownerId.toString(),
          model.PageId,
          null
        );
        this._isSilent = false;
        break;
      }
    }
  }

  public async loadDataAsync(
    menuParam: IMenuLoaderParam,
    show: boolean
  ): Promise<void> {
    this.container.setAttribute(`data-bc-bp-menu-seperation`, menuParam.owner);
    const newMenu = await this.cache.loadMenuAsync(
      menuParam,
      this.onMenuItemClick.bind(this)
    );
    if (show) {
      this.showMenu(newMenu);
    }
  }

  private showMenu(menu: MenuElement) {
    if (menu && this.current != menu) {
      this.current = menu;
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);
    }
  }

  private async onMenuItemClick(ownerId: string, pageId: string) {
    this.tryLoadPage(ownerId, pageId, null);
  }

  public tryLoadPageEx(
    category: MenuOwnerType,
    ownerId: string,
    pageId: string,
    args?: any
  ): boolean {
    const menu = this.cache.tryGetMenu(category, ownerId.toString());
    console.log("qam load menu ex", {
      category,
      ownerId,
      pageId,
      args,
      menu,
      cache: this.cache,
    });
    this.showMenu(menu);
    return menu ? this.tryLoadPage(ownerId.toString(), pageId, args) : false;
  }

  public tryLoadPage(ownerId: string, pageId: string, args?: any): boolean {
    let retVal = false;
    //const newPageId = typeof pageId === "string" ? pageId : pageId.toString();
    if (this.current) {
      const c = JSON.stringify(this.current.pageLookup);
      const menuItem = this.current.pageLookup.get(ownerId.toString());
      console.log(
        "qam menu",
        ownerId,
        pageId,
        menuItem,
        [...this.current.pageLookup.values()],
        this.current.pageLookup.get(ownerId.toString())
      );
      if (menuItem) {
        //update ui
        this.ul
          .querySelectorAll(`[data-bc-menu-active]`)
          .forEach((x) => x.removeAttribute("data-bc-menu-active"));
        const content = this.ul.querySelector(
          `a[data-bc-pid="${pageId}"][data-bc-mid][data-bc-ownerid="${menuItem?.ownerId}"]`
        );
        const li = content?.closest("li");
        const parent = content?.closest("[data-bc-bp-submenu]");
        if (parent) {
          parent
            .closest("li")
            .querySelector("[data-bc-level]")
            .setAttribute("data-bc-menu-active", "");
        }
        li?.setAttribute("data-bc-menu-active", "");
        console.log("qam menu element", {
          sel: `a[data-bc-pid="${pageId}"][data-bc-mid][data-bc-ownerid="${menuItem?.ownerId}"]`,
          ownerId,
          pageId,
          menuItem,
          content,
          li,
          parent,
        });
        //show page
        const newParam: IPageLoaderParam = {
          pageId: pageId,
          owner: this.current.param.owner, // menuItem.owner,
          ownerId: menuItem.ownerId,
          ownerUrl: menuItem.ownerUrl,
          rKey: menuItem.rKey,
          pageMethod: this.options.method.page,
          arguments: args,
          module: menuItem.module,
        };
        this.owner.setSource(
          this._isSilent ? DefaultSource.SET_PAGE : DefaultSource.DISPLAY_PAGE,
          newParam
        );
        retVal = true;
      }
    }
    return retVal;
  }
}
