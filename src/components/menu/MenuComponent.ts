import { ISource, IUserDefineComponent, IDependencyContainer } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import {
  DefaultSource,
  IModuleInfo,
  PageId,
  PanelLevels,
} from "../../type-alias";
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
  private lineHeader: HTMLElement;
  readonly menuContainer: HTMLDivElement;
  private readonly cache: MenuCacheManager;
  public current: MenuElement;
  public moduleMapper: Map<PanelLevels, Map<number, IModuleInfo>> = new Map<
    PanelLevels,
    Map<number, IModuleInfo>
  >();

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-menu-container");
    this.menuContainer = this.container.querySelector(
      "[data-bc-bp-menu-wrapper]"
    );
    this.ul = this.menuContainer.querySelector("[data-bc-menu]");
    this.cache = new MenuCacheManager(
      this.options.rKey,
      this.options.method.menu,
      this.options.checkRkey,
      this.deviceId as number,
      this.onMenuItemClick.bind(this)
    );
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .resolve<IDependencyContainer>("parent.dc")
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
    this.lineHeader = document.querySelector("[data-bc-header-line]");
    this.lineHeader.style.transition = "none";
    this.lineHeader.style.width = "0";
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([
      DefaultSource.SHOW_MENU,
      DefaultSource.BUSINESS_SOURCE,
    ]);
    setTimeout(() => {
      this.lineHeader.style.transition = "all 1s ease-in-out";
      this.lineHeader.style.width = "98%";
    }, 500);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      const headerLine = this.container.querySelector("[data-bc-header-line]");
      headerLine.setAttribute(
        `data-bc-bp-menu-seperation`,
        source.rows[0].level
      );
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    const newMenu = await this.cache.loadMenuAsync(
      menuParam.level,
      menuParam.levelId,
      menuParam.levelUrl
    );
    if (this.current != newMenu) {
      this.current = newMenu;
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
      // const tempPage = LocalStorageUtil.getCurrentPage();
      // if (tempPage) {
      //   //&& tempPage.pageId > 0) {
      //   if (LocalStorageUtil.hasMenuToActive()) {
      //     if (LocalStorageUtil.mustActiveMenuItem(menuParam.level)) {
      //       const temp = LocalStorageUtil.getCurrentMenu();
      //       const pid = temp?.info?.pid.toString();
      //       const mid = temp?.info?.mid.toString();
      //       const ownerId = temp?.ownerId.toString();
      //       // let [li, parent] = this.current.menuItemLookup.get(pid + "-" + mid);
      //       // li?.setAttribute("data-bc-menu-active", "");

      //       // if (parent) {
      //       //   parent.setAttribute("data-bc-menu-active", "");
      //       // }
      //     }
      //   }
      // }
    }
    this.tryLoadPage(
      menuParam.level,
      menuParam.levelId,
      menuParam.moduleId,
      menuParam.pageId,
      false,
      menuParam.pageArg
    );
    // const newParam: IPageLoaderParam = {
    //   level: menuParam.level,
    //   pageId: menuParam.pageId,
    //   levelId: menuParam.levelId,
    //   moduleUrl: menuParam.levelUrl,
    //   rKey: this.options.rKey,
    // };
    // this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  }

  private setMenuUISelected(
    level: PanelLevels,
    levelId: number,
    moduleId: number,
    pageId: PageId
  ) {
    let menuItem = this.menuContainer.querySelector(
      `a[data-bc-level="${level}"][data-bc-level-id="${levelId}"][data-bc-pid="${pageId}"][data-bc-mid="${moduleId}"]`
    );
    if (menuItem || pageId == "default") {
      this.menuContainer
        .querySelectorAll(`[data-bc-menu-active]`)
        .forEach((x) => x.removeAttribute("data-bc-menu-active"));
    }
    if (menuItem) {
      LocalStorageUtil.setMenuLastPage(pageId);
    } else if (pageId != "default") {
      pageId = LocalStorageUtil.menuPageId;
      menuItem = this.menuContainer.querySelector(
        `a[data-bc-level="${level}"][data-bc-level-id="${levelId}"][data-bc-pid="${pageId}"][data-bc-mid="${moduleId}"]`
      );
    }
    //console.log("qam menu 1", menuItem);
    //   `a[data-bc-level="${level}"][data-bc-level-id="${levelId}"][data-bc-pid="${pageId}"][data-bc-mid="${moduleId}"]`,
    //   this.menuContainer
    // );

    menuItem?.parentElement.setAttribute("data-bc-menu-active", "");
    const relatedMenuId = menuItem
      ?.closest("[data-bc-related-menu-id]")
      ?.getAttribute("data-bc-related-menu-id");
    if (relatedMenuId) {
      this.menuContainer
        ?.querySelector(
          `a[data-bc-level="${level}"][data-bc-level-id="${levelId}"][data-bc-mid="${moduleId}"][data-bc-menu-id="${relatedMenuId}"]`
        )
        ?.setAttribute("data-bc-menu-active", "");
    }
    // let [li, parent] = this.current.menuItemLookup.get(pageId + "-" + moduleId);
    //menuItem?.setAttribute("data-bc-menu-active", "");

    // if (parent) {
    //   parent.setAttribute("data-bc-menu-active", "");
    // }
  }

  private async onMenuItemClick(
    level: PanelLevels,
    levelId: number,
    moduleId: number,
    pageId: number,
    target: EventTarget
  ) {
    //LocalStorageUtil.setCurrentMenu(moduleId, node);
    this.tryLoadPage(level, levelId, moduleId, pageId, false, null);
  }
  public async tryLoadPage(
    level: PanelLevels,
    levelId: number | null,
    moduleId: number,
    pageId: PageId,
    isSilent: boolean,
    args: any | null
  ): Promise<boolean> {
    //console.log("qam mod 1", arguments);
    const moduleInfo = this.cache.getModuleInfo(level, levelId, moduleId);
    //console.log("qam mod", moduleInfo, level, levelId, moduleId, this.cache);
    if (moduleInfo) {
      const newParam: IPageLoaderParam = {
        level: level,
        pageId: pageId,
        levelId: moduleInfo.levelId,
        moduleId: moduleId,
        moduleName: moduleInfo.name,
        moduleUrl: moduleInfo.url,
        rKey: this.options.rKey,
        arguments: args,
        isSilent: isSilent ?? false,
      };
      LocalStorageUtil.setPageUrl(moduleInfo.url);
      this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
      this.setMenuUISelected(level, levelId, moduleId, pageId);
    }
    return moduleInfo != null;
  }

  public tryLoadPageEx(
    level: PanelLevels,
    moduleId: number,
    pageId: PageId,
    args?: any
  ): Promise<boolean> {
    return this.tryLoadPage(level, null, moduleId, pageId, false, args);
  }
}
