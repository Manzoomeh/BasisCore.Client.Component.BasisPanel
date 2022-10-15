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
import LocalStorageUtil from "../../LocalStorageUtil";

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
    this.cache = new MenuCacheManager(this.options.checkRkey, this.deviceId as number);
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
    
    if (this.deviceId == 1) {
      // for fix menu after scroll
      const menu = this.container;
      const themeContainer = this.container.closest("[data-bc-bp-main-container]").querySelector("[data-bc-bp-theme-container]");
      var sticky = (this.container as HTMLElement).offsetTop;
      window.onscroll = function() {
        if (window.pageYOffset >= sticky) {
          menu.setAttribute("data-bc-bp-sticky", "");
          themeContainer.setAttribute("data-bc-bp-sticky", "");
        } else {
          menu.removeAttribute("data-bc-bp-sticky");
          themeContainer.removeAttribute("data-bc-bp-sticky");
        }
      };
    } else if (this.deviceId == 2) {
      // add Event Listeners
      const openedMenu = this.container.querySelector('.opened-menu');
      const closedMenu = this.container.querySelector('.closed-menu');
      const navbarMenu = this.container.querySelector('.navbar');
      const menuOverlay = this.container.querySelector('.overlay');

      openedMenu.addEventListener("click", (e) => {
        this.toggleMenu([navbarMenu, menuOverlay]);
      });
      closedMenu.addEventListener("click", (e) => {
        this.toggleMenu([navbarMenu, menuOverlay]);
      });
      menuOverlay.addEventListener("click", (e) => {
        this.toggleMenu([navbarMenu, menuOverlay]);
      });
    }
  }

  private toggleMenu(elements: Array<Element>) {
    elements.forEach((el) => {
      el.classList.toggle('active');
    });
    document.body.classList.toggle('scrolling');
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([
      DefaultSource.SHOW_MENU,
      DefaultSource.BUSINESS_SOURCE,
    ]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    const newMenu = await this.cache.loadMenuAsync(
      menuParam,
      this.onMenuItemClick.bind(this)
    );
    if (this.current != newMenu) {
      this.current = newMenu;
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);

      const tempPage = LocalStorageUtil.getCurrentPage();
      if (tempPage && parseInt(tempPage.pageId) > 0) {
        if (LocalStorageUtil.hasMenuToActive()) {
          if (LocalStorageUtil.mustActiveMenuItem(menuParam.owner)) {
            const temp = LocalStorageUtil.getCurrentMenu();
            const pid = temp?.info?.pid.toString();
            const mid = temp?.info?.mid.toString();
            const ownerId = temp?.ownerId.toString();
            const content = this.ul.querySelector(`a[data-bc-pid="${pid}"][data-bc-mid="${mid}"][data-bc-ownerid="${ownerId}"]`);
            const li = content?.closest("li");
            const parent = content?.closest("[data-bc-bp-submenu]");
            if (parent) {
              parent
                .closest("li")
                .querySelector("[data-bc-level]")
                .setAttribute("data-bc-menu-active", "");
              li?.setAttribute("data-bc-menu-active", "");
            } else {
              li?.setAttribute("data-bc-menu-active", "");
            }
          }
        }
      }
    }
  }

  private async onMenuItemClick(
    pageId: string,
    param: IMenuLoaderParam,
    target: EventTarget
  ) {
      const newParam: IPageLoaderParam = {
        pageId: pageId,
        owner: param.owner,
        ownerId: param.ownerId,
        ownerUrl: param.ownerUrl,
        rKey: param.rKey,
        pageMethod: this.options.method.page,
      };
      this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);

      if (this.deviceId == 2) {
        const navbarMenu = this.container.querySelector('.navbar');
        const menuOverlay = this.container.querySelector('.overlay');
        this.toggleMenu([navbarMenu, menuOverlay]);
      }
  }

  public async tryLoadPage(pageId: string, args?: any): Promise<boolean> {
    var source = this.owner.tryToGetSource(DefaultSource.DISPLAY_PAGE);
    if (source) {
        const param = source.rows[0] as IPageLoaderParam;
        const newParam: IPageLoaderParam = {
          pageId: pageId,
          owner: param.owner,
          ownerId: param.ownerId,
          ownerUrl: param.ownerUrl,
          rKey: param.rKey,
          pageMethod: param.pageMethod,
          arguments: args,
        };
        this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
    }
    return source != null;
  }
}
