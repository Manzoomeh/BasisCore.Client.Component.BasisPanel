import HttpUtil from "../../HttpUtil";
import IMenuInfo, {
  IMenuLevelInfo,
  IMenuPageInfo,
  IMenuExternalItemInfo,
  IMenuItemInfo,
} from "./IMenuInfo";
import MenuElement from "./MenuElement";
import { ICheckRkeyOptions } from "./../basispanel/IBasisPanelOptions";
import {
  IModuleInfo,
  menuItemClickCallback,
  PanelLevels,
} from "../../type-alias";
import { BCWrapperFactory } from "basiscore";

export default class MenuElementMaker {
  readonly onMenuItemClick: menuItemClickCallback;
  private readonly checkRkeyOption: ICheckRkeyOptions;
  private readonly deviceId: number;
  private readonly modules: Map<number, IModuleInfo> = new Map<
    number,
    IModuleInfo
  >();
  private readonly rKey: string;
  private readonly menuMethod: string;
  private readonly level: PanelLevels;
  private readonly levelId: number;
  //public menuItemLookup: Map<string, HTMLElement[]>;

  constructor(
    level: PanelLevels,
    levelId: number,
    rKey: string,
    menuMethod: string,
    onMenuItemClick: menuItemClickCallback,
    checkRkey: ICheckRkeyOptions,
    deviceId: number
  ) {
    this.level = level;
    this.levelId = levelId;
    this.rKey = rKey;
    this.menuMethod = menuMethod;
    this.onMenuItemClick = onMenuItemClick;
    this.checkRkeyOption = checkRkey;
    this.deviceId = deviceId;
    //this.menuItemLookup = new Map<string, HTMLElement[]>();
  }

  public async createAsync(
    menuInfo: IMenuInfo,
    levelUrl: string
  ): Promise<MenuElement> {
    const tmpUL = document.createElement("ul");
    await this.createMenuAsync(tmpUL, menuInfo.nodes, levelUrl);
    return new MenuElement(
      Array.from(tmpUL.childNodes),
      this.level,
      this.modules
    );
  }

  private async createMenuAsync(
    ul: HTMLUListElement,
    items: Array<IMenuItemInfo>,
    moduleUrl: string,
    li?: HTMLElement
  ) {
    const tasks = items?.map(async (node) => {
      let retVal: HTMLLIElement;
      if ((node as IMenuExternalItemInfo).url) {
        this.modules.set(node.mid, {
          id: node.mid,
          name: (node as IMenuExternalItemInfo).name,
          url: (node as IMenuExternalItemInfo).url,
          title: (node as IMenuExternalItemInfo).title,
          levelId: this.levelId,
        });
      }
      if ((node as IMenuPageInfo).pid) {
        if (!this.modules.has(node.mid)) {
          this.modules.set(node.mid, {
            id: node.mid,
            levelId: this.levelId,
            name: this.level,
            title: this.level,
            url: moduleUrl,
          });
        }
        retVal = this.createPageMenuItem(node as IMenuPageInfo, li);
      } else if ((node as IMenuLevelInfo).nodes) {
        retVal = await this.createLevelMenuItemAsync(
          node as IMenuLevelInfo,
          moduleUrl,
          this.deviceId
        );
      } else if (
        (node as IMenuExternalItemInfo).mid &&
        (node as IMenuExternalItemInfo).multi
      ) {
        retVal = await this.createExternalMenuItem(
          node as IMenuExternalItemInfo,
          this.deviceId
        );
      } else if (
        (node as IMenuExternalItemInfo).mid &&
        !(node as IMenuExternalItemInfo).multi
      ) {
        retVal = await this.createExternalMenuItemSingleItemAsync(
          node as IMenuExternalItemInfo
        );
      }
      return retVal;
    });
    if (tasks) {
      (await Promise.all(tasks)).forEach((x) => ul.appendChild(x));
    }
  }

  private async createLevelMenuItemAsync(
    node: IMenuLevelInfo,
    ownerUrl: string,
    //pageLookup: Map<number, IMenuLoaderParam>,
    deviceId: number
  ): Promise<HTMLLIElement> {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-level-node", "");
    content.setAttribute("data-bc-level", this.level);
    content.setAttribute("data-bc-level-id", this.levelId.toString());
    content.setAttribute("data-bc-menu-id", node.title);
    content.appendChild(document.createTextNode(node.title));
    const innerUl = document.createElement("ul");
    innerUl.setAttribute("data-bc-bp-submenu", "");
    innerUl.setAttribute("data-bc-related-menu-id", node.title);
    if (node.nodes && node.nodes.length > 0) {
      content.setAttribute("data-bc-mid", node.nodes[0].mid?.toString());
      await this.createMenuAsync(innerUl, node.nodes, ownerUrl, li);
    }
    li.appendChild(content);
    document.querySelector("[data-bc-bp-menu-wrapper]").appendChild(innerUl);
    if (deviceId == 2) {
      content.addEventListener("click", function (e) {
        if (li.classList.contains("active")) {
          // collapseSubMenu();
          li.querySelector("[data-bc-bp-submenu]").removeAttribute("style");
          li.classList.remove("active");
        } else {
          // Collapse Existing Expanded menuItemHasChildren
          const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
          openMenu.forEach((e) => {
            if (e != li) {
              e.querySelector("[data-bc-bp-submenu]").removeAttribute("style");
              e.classList.remove("active");
            }
          });
          // Expand New menuItemHasChildren
          li.classList.add("active");
          const subMenu = li.querySelector("[data-bc-bp-submenu]");
          // (subMenu as HTMLElement).style.maxHeight = subMenu.scrollHeight + 'px';
          (subMenu as HTMLElement).style.maxHeight = "50rem";
          (subMenu as HTMLElement).style.transition = "all 1s ease";
          // subMenu.classList.add("show");
        }
      });
    } else {
      const liBoundingRect = document
        .querySelector("[data-bc-menu]")
        .getBoundingClientRect();
      innerUl.style.top = `${liBoundingRect.y + liBoundingRect.height}px`;
      li.addEventListener("click", function (e) {
        const parentBoundingRect = (
          e.target as HTMLElement
        ).getBoundingClientRect();
        innerUl.style.top = `${
          parentBoundingRect.y +
          parentBoundingRect.height +
          (!document.querySelector("[data-bc-bp-sticky]")
            ? window.pageYOffset
            : 0)
        }px`;
        innerUl.style.left = `${
          parentBoundingRect.x -
          (innerUl.offsetWidth - parentBoundingRect.width)
        }px`;

        if (innerUl.getAttribute("data-bc-ul-level-open") == null) {
          const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
          openMenu.forEach((e) => {
            (e as HTMLElement).style.maxHeight = `0px`;
            e.removeAttribute("data-bc-ul-level-open");
            e.previousElementSibling.removeAttribute("data-bc-level-open");
          });

          innerUl.setAttribute("data-bc-ul-level-open", "1");
          content.setAttribute("data-bc-level-open", "");
          innerUl.style.maxHeight = `500px`;
          innerUl.style.opacity = `1`;
        } else {
          innerUl.style.maxHeight = `0px`;
          innerUl.removeAttribute("data-bc-ul-level-open");
          innerUl.previousElementSibling.removeAttribute("data-bc-level-open");
        }
      });
    }
    return li;
  }

  private createPageMenuItem(
    node: IMenuPageInfo,
    parentLi: HTMLElement
  ): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");

    content.setAttribute("data-sys-menu-link", "");
    content.setAttribute("data-bc-level", this.level);
    content.setAttribute("data-bc-level-id", this.levelId.toString());
    content.setAttribute("data-bc-pid", node.pid.toString());
    content.setAttribute("data-bc-mid", node.mid?.toString());
    //content.setAttribute("data-bc-ownerid", menuParam.ownerId?.toString());
    content.appendChild(document.createTextNode(node.title));
    content.addEventListener("click", (e) => {
      e.preventDefault();
      this.onMenuItemClick(
        this.level,
        this.levelId,
        node.mid,
        node.pid,
        e.target
      );
      document.body.classList.remove("scrolling");

      const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
      activeMenus.forEach((e) => {
        e.removeAttribute("data-bc-menu-active");
      });
      if (parentLi) {
        parentLi.setAttribute("data-bc-menu-active", "");
        li.setAttribute("data-bc-menu-active", "");
      } else {
        li.setAttribute("data-bc-menu-active", "");
      }

      if (this.deviceId == 2) {
        li.closest("[data-bc-bp-header-more-container]").classList.remove(
          "active"
        );
      }

      //LocalStorageUtil.setCurrentMenu(menuParam.ownerId, node);
    });
    //pageLookup.set(node.pid, menuParam);
    li.appendChild(content);
    return li;
  }
  private async createExternalMenuItemSingleItemAsync(
    node: IMenuExternalItemInfo
    //menuParam: IMenuLoaderParam
    //pageLookup: Map<number, IMenuLoaderParam>
  ): Promise<HTMLLIElement> {
    // const newMenuParam: IMenuLoaderParam = {
    //   level: menuParam.level,
    //   ownerId: node.mid,
    //   ownerUrl: node.url,
    // };
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    li.setAttribute("data-bc-bp-menu-external-title", "");
    li.setAttribute("data-sys-menu-external", "");
    ul.setAttribute("data-bc-bp-menu-external-single-node", "");

    li.appendChild(ul);
    const url = HttpUtil.formatString(`${node.url}${this.menuMethod}`, {
      rKey: this.rKey,
      level: this.level,
    });

    const menu = await HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
      url,
      "GET",
      this.checkRkeyOption
    );
    if (menu) {
      await this.createMenuAsync(ul, menu.nodes, node.url, li);
    }

    return li;
  }
  private async createExternalMenuItem(
    node: IMenuExternalItemInfo,
    deviceId: number
  ): Promise<HTMLLIElement> {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-sys-menu-link", "");
    li.setAttribute("data-bc-bp-menu-external-title", "");
    li.setAttribute("data-sys-menu-external", "");
    content.appendChild(document.createTextNode(node.title));
    li.appendChild(content);
    const ul = document.createElement("ul");
    ul.setAttribute("data-bc-bp-menu-external", "");
    content.setAttribute("data-bc-bp-menu-external-level", "");
    li.appendChild(ul);
    let subMenuFlag = false;
    if (deviceId == 2) {
      content.addEventListener("click", function (e) {
        if (li.classList.contains("active")) {
          // collapseSubMenu();
          li.querySelector("[data-bc-bp-menu-external]").removeAttribute(
            "style"
          );
          document.body.classList.remove("scrolling");

          li.classList.remove("active");
        } else {
          // Collapse Existing Expanded menuItemHasChildren
          const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
          openMenu.forEach((e) => {
            e.querySelector("[data-bc-bp-menu-external]").removeAttribute(
              "style"
            );
            e.classList.remove("active");
          });
          // Expand New menuItemHasChildren
          li.classList.add("active");
          const subMenu = li.querySelector("[data-bc-bp-menu-external]");
          // (subMenu as HTMLElement).style.maxHeight = subMenu.scrollHeight + 'px';
          (subMenu as HTMLElement).style.maxHeight = "50rem";
          (subMenu as HTMLElement).style.transition = "all 1s ease";
          // subMenu.classList.add("show");
        }
      });
    } else {
      content.addEventListener("click", function () {
        if (subMenuFlag == false) {
          ul.style.transition = "all 0.3s ease-in-out";
          ul.style.width = `auto`;
          ul.style.overflow = `visible`;
          content.setAttribute("data-bc-bp-menu-external-open", "");
          subMenuFlag = true;
        } else {
          ul.style.transition = "all 0.3s ease-in-out";
          ul.style.width = `0`;
          ul.style.overflow = `hidden`;
          content.removeAttribute("data-bc-bp-menu-external-open");
          subMenuFlag = false;
        }
      });
    }
    const url = HttpUtil.formatString(`${node.url}${this.menuMethod}`, {
      rKey: this.rKey,
      level: this.level,
    });

    const menu = await HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
      url,
      "GET",
      this.checkRkeyOption
    );
    if (menu) {
      this.createMenuAsync(ul, menu.nodes, node.url, li);
    }

    return li;
  }
}
