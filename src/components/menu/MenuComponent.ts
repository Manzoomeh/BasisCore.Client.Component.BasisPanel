import { ISource, IUserDefineComponent, IDependencyContainer } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { DefaultSource, IModuleInfo, MenuOwnerType } from "../../type-alias";
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
  public current: MenuElement;
  public moduleMapper: Map<MenuOwnerType, Map<string, IModuleInfo>> = new Map<
    MenuOwnerType,
    Map<string, IModuleInfo>
  >();

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
      DefaultSource.BUSINESS_SOURCE,
    ]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      this.container.setAttribute(
        `data-bc-bp-menu-seperation`,
        source.rows[0].owner
      );
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    const newMenu = await this.cache.loadMenuAsync(
      menuParam,
      this.moduleMapper,
      this.onMenuItemClick.bind(this)
    );
    if (this.current != newMenu) {
      this.current = newMenu;
      console.log("qam load menu", this.current);
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);
      if (this.deviceId == 1) {
        window.addEventListener("scroll", () => {
          document
            .querySelectorAll("[data-bc-ul-level-open]")
            .forEach((el: HTMLElement) => {
              el.style.maxHeight = `0px`;
              el.style.opacity = `0`;
              el.removeAttribute("data-bc-ul-level-open");
              el.previousElementSibling.removeAttribute("data-bc-level-open");
            });
        });
        window.addEventListener("resize", () => {
          document
            .querySelectorAll("[data-bc-ul-level-open]")
            .forEach((el: HTMLElement) => {
              el.style.maxHeight = `0px`;
              el.style.opacity = `0`;
              el.removeAttribute("data-bc-ul-level-open");
              el.previousElementSibling.removeAttribute("data-bc-level-open");
            });
        });
        this.ul.addEventListener("scroll", () => {
          document
            .querySelectorAll("[data-bc-ul-level-open]")
            .forEach((el: HTMLElement) => {
              el.style.maxHeight = `0px`;
              el.style.opacity = `0`;
              el.removeAttribute("data-bc-ul-level-open");
              el.previousElementSibling.removeAttribute("data-bc-level-open");
            });
        });
      }
      const tempPage = LocalStorageUtil.getCurrentPage();
      if (tempPage && parseInt(tempPage.pageId) > 0) {
        if (LocalStorageUtil.hasMenuToActive()) {
          if (LocalStorageUtil.mustActiveMenuItem(menuParam.owner)) {
            const temp = LocalStorageUtil.getCurrentMenu();
            const pid = temp?.info?.pid.toString();
            const mid = temp?.info?.mid.toString();
            const ownerId = temp?.ownerId.toString();
            let [li, parent] = this.current.menuItemLookup.get(pid + "-" + mid);
            li?.setAttribute("data-bc-menu-active", "");

            if (parent) {
              parent.setAttribute("data-bc-menu-active", "");
            }
          }
        }
      }
      if (menuParam.pageId) {
        const newParam: IPageLoaderParam = {
          pageId: menuParam.pageId,
          owner: menuParam.owner,
          ownerId: menuParam.ownerId.toString(),
          ownerUrl: menuParam.ownerUrl,
          rKey: this.options.rKey,
          pageMethod: this.options.method.page,
        };
        this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
      }
    }
  }

  private setMenuUISelected(pageId: string, moduleId: string) {
    const selectedItem = this.ul.querySelector(`li[data-bc-menu-active]`);
    if (selectedItem) {
      selectedItem.removeAttribute("data-bc-menu-active");
    }
    const content = this.ul.querySelector(
      `a[data-bc-pid="${pageId}"][data-bc-mid="${moduleId}"][data-bc-ownerid]`
    );
    let [li, parent] = this.current.menuItemLookup.get(pageId + "-" + moduleId);
    li?.setAttribute("data-bc-menu-active", "");

    if (parent) {
      parent.setAttribute("data-bc-menu-active", "");
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
    console.log(`qam menu select`, newParam);
    this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  }

  public async tryLoadPageEx(
    owner: MenuOwnerType,
    moduleId: string,
    pageId: string,
    args?: any
  ): Promise<boolean> {
    const ownerInfo = this.moduleMapper.get(owner);
    if (ownerInfo) {
      const moduleInfo = ownerInfo.get(moduleId);
      if (moduleInfo) {
        const newParam: IPageLoaderParam = {
          pageId: pageId,
          owner: moduleInfo.owner,
          ownerId: moduleId,
          ownerUrl: moduleInfo.ownerUrl,
          rKey: this.options.rKey,
          pageMethod: this.options.method.page,
          arguments: args,
        };
        this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
        this.setMenuUISelected(pageId, moduleId);
      }
    }
    return ownerInfo != null;
  }

  public async tryLoadPage(pageId: string, args?: any): Promise<boolean> {
    const source = this.owner.tryToGetSource(DefaultSource.DISPLAY_PAGE);
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
