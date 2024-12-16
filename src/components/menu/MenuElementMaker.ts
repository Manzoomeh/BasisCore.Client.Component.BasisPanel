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
    const tmpDiv = document.createElement("div");

    await this.createMenuAsync(tmpUL, tmpDiv, menuInfo.nodes, levelUrl);
    return new MenuElement(
      Array.from(tmpUL.childNodes),
      Array.from(tmpDiv.childNodes),
      this.level,
      this.modules
    );
  }

  private async createMenuAsync(
    ul: HTMLUListElement,
    div: HTMLDivElement,
    items: Array<IMenuItemInfo>,
    moduleUrl: string,
    li?: HTMLElement
  ) {
    const tasks = items?.map(async (node) => {
      let retVal: HTMLLIElement|HTMLAnchorElement;
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
        if (this.deviceId == 1 && node.showInToolbox) {
          retVal = this.createPageToolboxItem(node as IMenuPageInfo);
        } else {
          retVal = this.createPageMenuItem(node as IMenuPageInfo, li);
        }
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
      (await Promise.all(tasks)).forEach((x) => {
        if (x instanceof HTMLLIElement) {
          ul.appendChild(x)
        } else if (x instanceof HTMLAnchorElement) {
          div.appendChild(x)
        }
      });
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
      await this.createMenuAsync(innerUl, null, node.nodes, ownerUrl, li);
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

      this.changeToolBoxIcon("reset");

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

  private createPageToolboxItem(
    node: IMenuPageInfo
  ): HTMLAnchorElement {
    const divItem = document.createElement("a");
    divItem.setAttribute("data-bc-bp-menu-toolbox-item", "");
    divItem.setAttribute("data-bc-bp-d1-menu-toolbox-item", "");
    divItem.setAttribute("data-bc-level", this.level);
    divItem.setAttribute("data-bc-level-id", this.levelId.toString());
    divItem.setAttribute("data-bc-pid", node.pid.toString());
    divItem.setAttribute("data-bc-mid", node.mid?.toString());

    const divItemIcon = document.createElement("div");
    divItemIcon.setAttribute("data-bc-bp-menu-toolbox-item-icon", "");
    divItemIcon.setAttribute("data-bc-bp-d1-menu-toolbox-item-icon", "");
    if (node.image) {
      divItemIcon.innerHTML = node.image;
    } else {
      divItemIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 12C1.08333 12 0.729167 11.8542 0.4375 11.5625C0.145834 11.2708 3.57628e-07 10.9167 3.57628e-07 10.5C3.57628e-07 10.0833 0.145834 9.72917 0.4375 9.4375C0.729167 9.14583 1.08333 9 1.5 9C1.91667 9 2.27083 9.14583 2.5625 9.4375C2.85417 9.72917 3 10.0833 3 10.5C3 10.9167 2.85417 11.2708 2.5625 11.5625C2.27083 11.8542 1.91667 12 1.5 12ZM6 12C5.58333 12 5.22917 11.8542 4.9375 11.5625C4.64583 11.2708 4.5 10.9167 4.5 10.5C4.5 10.0833 4.64583 9.72917 4.9375 9.4375C5.22917 9.14583 5.58333 9 6 9C6.41667 9 6.77083 9.14583 7.0625 9.4375C7.35417 9.72917 7.5 10.0833 7.5 10.5C7.5 10.9167 7.35417 11.2708 7.0625 11.5625C6.77083 11.8542 6.41667 12 6 12ZM10.5 12C10.0833 12 9.72917 11.8542 9.4375 11.5625C9.14583 11.2708 9 10.9167 9 10.5C9 10.0833 9.14583 9.72917 9.4375 9.4375C9.72917 9.14583 10.0833 9 10.5 9C10.9167 9 11.2708 9.14583 11.5625 9.4375C11.8542 9.72917 12 10.0833 12 10.5C12 10.9167 11.8542 11.2708 11.5625 11.5625C11.2708 11.8542 10.9167 12 10.5 12ZM1.5 7.5C1.08333 7.5 0.729167 7.35417 0.4375 7.0625C0.145834 6.77083 3.57628e-07 6.41667 3.57628e-07 6C3.57628e-07 5.58333 0.145834 5.22917 0.4375 4.9375C0.729167 4.64583 1.08333 4.5 1.5 4.5C1.91667 4.5 2.27083 4.64583 2.5625 4.9375C2.85417 5.22917 3 5.58333 3 6C3 6.41667 2.85417 6.77083 2.5625 7.0625C2.27083 7.35417 1.91667 7.5 1.5 7.5ZM6 7.5C5.58333 7.5 5.22917 7.35417 4.9375 7.0625C4.64583 6.77083 4.5 6.41667 4.5 6C4.5 5.58333 4.64583 5.22917 4.9375 4.9375C5.22917 4.64583 5.58333 4.5 6 4.5C6.41667 4.5 6.77083 4.64583 7.0625 4.9375C7.35417 5.22917 7.5 5.58333 7.5 6C7.5 6.41667 7.35417 6.77083 7.0625 7.0625C6.77083 7.35417 6.41667 7.5 6 7.5ZM10.5 7.5C10.0833 7.5 9.72917 7.35417 9.4375 7.0625C9.14583 6.77083 9 6.41667 9 6C9 5.58333 9.14583 5.22917 9.4375 4.9375C9.72917 4.64583 10.0833 4.5 10.5 4.5C10.9167 4.5 11.2708 4.64583 11.5625 4.9375C11.8542 5.22917 12 5.58333 12 6C12 6.41667 11.8542 6.77083 11.5625 7.0625C11.2708 7.35417 10.9167 7.5 10.5 7.5ZM1.5 3C1.08333 3 0.729167 2.85417 0.4375 2.5625C0.145834 2.27083 3.57628e-07 1.91667 3.57628e-07 1.5C3.57628e-07 1.08333 0.145834 0.729166 0.4375 0.437499C0.729167 0.145832 1.08333 -1.43051e-06 1.5 -1.43051e-06C1.91667 -1.43051e-06 2.27083 0.145832 2.5625 0.437499C2.85417 0.729166 3 1.08333 3 1.5C3 1.91667 2.85417 2.27083 2.5625 2.5625C2.27083 2.85417 1.91667 3 1.5 3ZM6 3C5.58333 3 5.22917 2.85417 4.9375 2.5625C4.64583 2.27083 4.5 1.91667 4.5 1.5C4.5 1.08333 4.64583 0.729166 4.9375 0.437499C5.22917 0.145832 5.58333 -1.43051e-06 6 -1.43051e-06C6.41667 -1.43051e-06 6.77083 0.145832 7.0625 0.437499C7.35417 0.729166 7.5 1.08333 7.5 1.5C7.5 1.91667 7.35417 2.27083 7.0625 2.5625C6.77083 2.85417 6.41667 3 6 3ZM10.5 3C10.0833 3 9.72917 2.85417 9.4375 2.5625C9.14583 2.27083 9 1.91667 9 1.5C9 1.08333 9.14583 0.729166 9.4375 0.437499C9.72917 0.145832 10.0833 -1.43051e-06 10.5 -1.43051e-06C10.9167 -1.43051e-06 11.2708 0.145832 11.5625 0.437499C11.8542 0.729166 12 1.08333 12 1.5C12 1.91667 11.8542 2.27083 11.5625 2.5625C11.2708 2.85417 10.9167 3 10.5 3Z" fill="#004B85"/></svg>`;
    }

    const divItemText = document.createElement("div");
    divItemText.setAttribute("data-bc-bp-menu-toolbox-item-text", "");
    divItemText.setAttribute("data-bc-bp-d1-menu-toolbox-item-text", "");
    divItemText.textContent = node.title;

    divItem.appendChild(divItemIcon);
    divItem.appendChild(divItemText);

    divItem.addEventListener("click", (e) => {
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

      const currentIcon = divItem.querySelector("[data-bc-bp-menu-toolbox-item-icon]").innerHTML;
      document.querySelector("[data-bc-bp-menu-toolbox-wrapper]").setAttribute("data-bc-bp-menu-toolbox", "");
      this.changeToolBoxIcon("set", currentIcon);
    });

    return divItem;
  }
  
  private changeToolBoxIcon(status: "set"|"reset", icon?: string) {
    const toolboxContainer = document.querySelector("[data-bc-bp-menu-toolbox-wrapper]");
    const buttonContainer = toolboxContainer.querySelector("[data-bc-bp-menu-toolbox-button]");
    if (status == "set") {
      buttonContainer.innerHTML = icon;
    } else if (status == "reset") {
      buttonContainer.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 12C1.08333 12 0.729167 11.8542 0.4375 11.5625C0.145834 11.2708 3.57628e-07 10.9167 3.57628e-07 10.5C3.57628e-07 10.0833 0.145834 9.72917 0.4375 9.4375C0.729167 9.14583 1.08333 9 1.5 9C1.91667 9 2.27083 9.14583 2.5625 9.4375C2.85417 9.72917 3 10.0833 3 10.5C3 10.9167 2.85417 11.2708 2.5625 11.5625C2.27083 11.8542 1.91667 12 1.5 12ZM6 12C5.58333 12 5.22917 11.8542 4.9375 11.5625C4.64583 11.2708 4.5 10.9167 4.5 10.5C4.5 10.0833 4.64583 9.72917 4.9375 9.4375C5.22917 9.14583 5.58333 9 6 9C6.41667 9 6.77083 9.14583 7.0625 9.4375C7.35417 9.72917 7.5 10.0833 7.5 10.5C7.5 10.9167 7.35417 11.2708 7.0625 11.5625C6.77083 11.8542 6.41667 12 6 12ZM10.5 12C10.0833 12 9.72917 11.8542 9.4375 11.5625C9.14583 11.2708 9 10.9167 9 10.5C9 10.0833 9.14583 9.72917 9.4375 9.4375C9.72917 9.14583 10.0833 9 10.5 9C10.9167 9 11.2708 9.14583 11.5625 9.4375C11.8542 9.72917 12 10.0833 12 10.5C12 10.9167 11.8542 11.2708 11.5625 11.5625C11.2708 11.8542 10.9167 12 10.5 12ZM1.5 7.5C1.08333 7.5 0.729167 7.35417 0.4375 7.0625C0.145834 6.77083 3.57628e-07 6.41667 3.57628e-07 6C3.57628e-07 5.58333 0.145834 5.22917 0.4375 4.9375C0.729167 4.64583 1.08333 4.5 1.5 4.5C1.91667 4.5 2.27083 4.64583 2.5625 4.9375C2.85417 5.22917 3 5.58333 3 6C3 6.41667 2.85417 6.77083 2.5625 7.0625C2.27083 7.35417 1.91667 7.5 1.5 7.5ZM6 7.5C5.58333 7.5 5.22917 7.35417 4.9375 7.0625C4.64583 6.77083 4.5 6.41667 4.5 6C4.5 5.58333 4.64583 5.22917 4.9375 4.9375C5.22917 4.64583 5.58333 4.5 6 4.5C6.41667 4.5 6.77083 4.64583 7.0625 4.9375C7.35417 5.22917 7.5 5.58333 7.5 6C7.5 6.41667 7.35417 6.77083 7.0625 7.0625C6.77083 7.35417 6.41667 7.5 6 7.5ZM10.5 7.5C10.0833 7.5 9.72917 7.35417 9.4375 7.0625C9.14583 6.77083 9 6.41667 9 6C9 5.58333 9.14583 5.22917 9.4375 4.9375C9.72917 4.64583 10.0833 4.5 10.5 4.5C10.9167 4.5 11.2708 4.64583 11.5625 4.9375C11.8542 5.22917 12 5.58333 12 6C12 6.41667 11.8542 6.77083 11.5625 7.0625C11.2708 7.35417 10.9167 7.5 10.5 7.5ZM1.5 3C1.08333 3 0.729167 2.85417 0.4375 2.5625C0.145834 2.27083 3.57628e-07 1.91667 3.57628e-07 1.5C3.57628e-07 1.08333 0.145834 0.729166 0.4375 0.437499C0.729167 0.145832 1.08333 -1.43051e-06 1.5 -1.43051e-06C1.91667 -1.43051e-06 2.27083 0.145832 2.5625 0.437499C2.85417 0.729166 3 1.08333 3 1.5C3 1.91667 2.85417 2.27083 2.5625 2.5625C2.27083 2.85417 1.91667 3 1.5 3ZM6 3C5.58333 3 5.22917 2.85417 4.9375 2.5625C4.64583 2.27083 4.5 1.91667 4.5 1.5C4.5 1.08333 4.64583 0.729166 4.9375 0.437499C5.22917 0.145832 5.58333 -1.43051e-06 6 -1.43051e-06C6.41667 -1.43051e-06 6.77083 0.145832 7.0625 0.437499C7.35417 0.729166 7.5 1.08333 7.5 1.5C7.5 1.91667 7.35417 2.27083 7.0625 2.5625C6.77083 2.85417 6.41667 3 6 3ZM10.5 3C10.0833 3 9.72917 2.85417 9.4375 2.5625C9.14583 2.27083 9 1.91667 9 1.5C9 1.08333 9.14583 0.729166 9.4375 0.437499C9.72917 0.145832 10.0833 -1.43051e-06 10.5 -1.43051e-06C10.9167 -1.43051e-06 11.2708 0.145832 11.5625 0.437499C11.8542 0.729166 12 1.08333 12 1.5C12 1.91667 11.8542 2.27083 11.5625 2.5625C11.2708 2.85417 10.9167 3 10.5 3Z" fill="#004B85"/></svg>`;
    }
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
      await this.createMenuAsync(ul, null, menu.nodes, node.url, li);
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
          ul.style.width = `max-content`;
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
      this.createMenuAsync(ul, null, menu.nodes, node.url, li);
    }

    return li;
  }
}
