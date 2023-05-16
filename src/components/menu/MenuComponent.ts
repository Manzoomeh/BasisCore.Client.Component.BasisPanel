import { ISource, IUserDefineComponent, IDependencyContainer } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { DefaultSource } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";
import { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import IPageLoaderParam from "./IPageLoaderParam";
import IPageLoader from "./IPageLoader";
import LocalStorageUtil, { ICurrentMenu } from "../../LocalStorageUtil";

export default class MenuComponent
  extends BasisPanelChildComponent
  implements IPageLoader
{
  readonly ul: HTMLUListElement;
  private cache: MenuCacheManager;
  private current: MenuElement;

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
    this.owner.addTrigger([DefaultSource.SHOW_MENU, DefaultSource.SET_MENU]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      const menuParam: IMenuLoaderParam = source.rows[0];
      await this.loadDataAsync(menuParam);
      if (menuParam.pageId) {
        this.tryLoadPage(menuParam.pageId, null);
      }
    } else if (source?.id === DefaultSource.SET_MENU) {
      const menuParam: ICurrentMenu = source.rows[0];
      await this.loadDataAsync(menuParam.menu);
      this.setActiveItem(menuParam);
    }
  }

  private setActiveItem(menuParam: ICurrentMenu) {
    const pid = menuParam?.info?.pid;
    const mid = menuParam?.info?.mid;
    const ownerId = menuParam?.ownerId;
    this.ul
      .querySelectorAll(`[data-bc-menu-active]`)
      .forEach((x) => x.removeAttribute("data-bc-menu-active"));
    const content = this.ul.querySelector(
      `a[data-bc-pid="${pid}"][data-bc-mid="${mid}"][data-bc-ownerid="${ownerId}"]`
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
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    LocalStorageUtil.setCurrentMenu(menuParam);
    this.container.setAttribute(`data-bc-bp-menu-seperation`, menuParam.owner);
    const newMenu = await this.cache.loadMenuAsync(
      menuParam,
      this.onMenuItemClick.bind(this)
    );
    if (this.current != newMenu) {
      this.current = newMenu;
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);
    }
  }

  private async onMenuItemClick(pageId: string) {
    this.tryLoadPage(pageId, null);
  }

  public tryLoadPage(pageId: string, args?: any): boolean {
    let retVal = false;
    if (this.current) {
      const menuItem = this.current.pageLookup.get(pageId);
      if (menuItem) {
        //update ui
        this.ul
          .querySelectorAll(`[data-bc-menu-active]`)
          .forEach((x) => x.removeAttribute("data-bc-menu-active"));
        const content = this.ul.querySelector(
          `a[data-bc-pid="${menuItem.pageId}"][data-bc-mid][data-bc-ownerid="${menuItem?.ownerId}"]`
        );
        console.log(
          `a[data-bc-pid="${menuItem.pageId}"][data-bc-mid][data-bc-ownerid="${menuItem?.ownerId}"]`,
          content
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
        //show page
        const newParam: IPageLoaderParam = {
          pageId: pageId,
          owner: menuItem.owner,
          ownerId: menuItem.ownerId,
          ownerUrl: menuItem.ownerUrl,
          rKey: menuItem.rKey,
          pageMethod: this.options.method.page,
          arguments: args,
        };
        this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
        retVal = true;
      }
    }
    return retVal;
  }
}
