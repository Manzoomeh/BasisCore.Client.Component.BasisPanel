import HttpUtil from "../../HttpUtil";
import IMenuInfo, {
  IMenuLevelInfo,
  IMenuPageInfo,
  IMenuExternalItemInfo,
  IMenuItemInfo,
  IMenuLoaderParam,
} from "./IMenuInfo";
import MenuElement from "./MenuElement";
import { ICheckRkeyOptions } from "./../basispanel/IBasisPanelOptions";
import LocalStorageUtil from "../../LocalStorageUtil";
import { IModuleInfo } from "../../type-alias";

export default class MenuElementMaker {
  readonly rKey: string;
  readonly onMenuItemClick: (
    pageId: string,
    param: IMenuLoaderParam,
    target: EventTarget
  ) => void;
  private checkRkeyOption: ICheckRkeyOptions;
  private deviceId: number;
  private moduleMapper: Map<string, IModuleInfo>;

  constructor(
    rKey: string,
    moduleMapper: Map<string, IModuleInfo>,
    onMenuItemClick: (
      pageId: string,
      param: IMenuLoaderParam,
      target: EventTarget
    ) => void,
    checkRkey: ICheckRkeyOptions,
    deviceId: number
  ) {
    this.rKey = rKey;
    this.onMenuItemClick = onMenuItemClick;
    this.checkRkeyOption = checkRkey;
    this.deviceId = deviceId;
    this.moduleMapper = moduleMapper;
  }

  public create(menuInfo: IMenuInfo, menuParam: IMenuLoaderParam): MenuElement {
    const tmpUL = document.createElement("ul");
    const pageLookup = new Map<string, IMenuLoaderParam>();
    this.createMenu(tmpUL, menuInfo.nodes, menuParam, pageLookup);
    return new MenuElement(menuParam, pageLookup, Array.from(tmpUL.childNodes));
  }

  private createMenu(
    ul: HTMLUListElement,
    items: Array<IMenuItemInfo>,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    isExternal: boolean = false
  ) {
    items.forEach((node, i) => {
      if ((node as IMenuExternalItemInfo).url) {
        this.moduleMapper.set(node.mid, {
          owner: menuParam.owner,
          ownerUrl: (node as IMenuExternalItemInfo).url,
        });
      }
      if ((node as IMenuPageInfo).pid) {
        ul.appendChild(
          this.createPageMenuItem(
            node as IMenuPageInfo,
            menuParam,
            pageLookup,
            i,
            isExternal
          )
        );
      } else if ((node as IMenuLevelInfo).nodes) {
        ul.appendChild(
          this.createLevelMenuItem(
            node as IMenuLevelInfo,
            menuParam,
            pageLookup,
            this.deviceId,
            i,
            isExternal
          )
        );
      } else if (
        (node as IMenuExternalItemInfo).mid &&
        (node as IMenuExternalItemInfo).multi == true
      ) {
        ul.appendChild(
          this.createExternalMenuItem(
            node as IMenuExternalItemInfo,
            menuParam,
            pageLookup,
            this.deviceId,
            i,
            isExternal
          )
        );
      } else if (
        (node as IMenuExternalItemInfo).mid &&
        (node as IMenuExternalItemInfo).multi == false
      ) {
        ul.appendChild(
          this.createExternalMenuItemSingleItem(
            node as IMenuExternalItemInfo,
            menuParam,
            pageLookup,
            i
          )
        );
      }
    });
  }
  dragStart(event) {
    event.dataTransfer.setData(
      "text/plain",
      event.target.attributes["key"].value
    );
  }

  dragOver(event) {
    event.preventDefault();
  }

  drop(event) {
    event.preventDefault();

    var itemId = event.dataTransfer.getData("text/plain");
    var item = document.querySelector(`[key="${itemId}"]`);

    event.target.closest("[key]").insertAdjacentElement("beforebegin", item);
  }
  private createLevelMenuItem(
    node: IMenuLevelInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    deviceId: number,
    key: number,
    isExternal: boolean
  ): HTMLLIElement {
    const li = document.createElement("li");
    if (!isExternal) {
      li.setAttribute("key", String(key));
      li.setAttribute("draggable", String(true));
      li.addEventListener("dragstart", (e) => this.dragStart(e));
      li.addEventListener("dragover", (e) => this.dragOver(e));
      li.addEventListener("drop", (e) => this.drop(e));
    }

    const content = document.createElement("a");
    content.setAttribute("data-bc-level", "");
    content.appendChild(document.createTextNode(node.title));
    const innerUl = document.createElement("ul");
    innerUl.setAttribute("data-bc-bp-submenu", "");
    this.createMenu(innerUl, node.nodes, menuParam, pageLookup, true);
    li.appendChild(content);
    li.appendChild(innerUl);
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
            e.querySelector("[data-bc-bp-submenu]").removeAttribute("style");
            e.classList.remove("active");
          });
          // Expand New menuItemHasChildren
          li.classList.add("active");
          const subMenu = li.querySelector("[data-bc-bp-submenu]");
          // (subMenu as HTMLElement).style.maxHeight = subMenu.scrollHeight + 'px';
          (subMenu as HTMLElement).style.maxHeight = "20rem";
          (subMenu as HTMLElement).style.transition = "all 1s ease";
          // subMenu.classList.add("show");
        }
      });
    } else {
      li.addEventListener("click", function (e) {
        if (innerUl.getAttribute("data-bc-ul-level-open") == null) {
          const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
          openMenu.forEach((e) => {
            (e as HTMLElement).style.transform = ` scaleY(0)`;
            e.removeAttribute("data-bc-ul-level-open");
            e.previousElementSibling.removeAttribute("data-bc-level-open");
          });
          innerUl.style.transform = `scaleY(1)`;
          innerUl.setAttribute("data-bc-ul-level-open", "1");
          content.setAttribute("data-bc-level-open", "");
        } else {
          innerUl.style.transform = ` scaleY(0)`;
          innerUl.removeAttribute("data-bc-ul-level-open");
          innerUl.previousElementSibling.removeAttribute("data-bc-level-open");
        }
      });
    }
    return li;
  }

  private createPageMenuItem(
    node: IMenuPageInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    key: number,
    isExternal: boolean
  ): HTMLLIElement {
    if (!this.moduleMapper.has(node.mid)) {
      this.moduleMapper.set(node.mid, {
        owner: menuParam.owner,
        ownerUrl: menuParam.ownerUrl,
      });
    }
    const li = document.createElement("li");
    if (!isExternal) {
      li.setAttribute("key", String(key));
      li.setAttribute("draggable", String(true));
      li.addEventListener("dragstart", (e) => this.dragStart(e));
      li.addEventListener("dragover", (e) => this.dragOver(e));
      li.addEventListener("drop", (e) => this.drop(e));
    }
    const content = document.createElement("a");
    content.setAttribute("data-sys-menu-link", "");
    content.setAttribute("data-bc-pid", node.pid.toString());
    content.setAttribute("data-bc-mid", node.mid?.toString());
    content.setAttribute("data-bc-ownerid", menuParam.ownerId?.toString());
    content.appendChild(document.createTextNode(node.title));
    content.addEventListener("click", (e) => {
      e.preventDefault();
      this.onMenuItemClick(node.pid, menuParam, e.target);
      document.body.classList.remove("scrolling");

      const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
      activeMenus.forEach((e) => {
        e.removeAttribute("data-bc-menu-active");
      });

      const parent = content.closest("[data-bc-bp-submenu]");
      if (parent) {
        parent
          .closest("li")
          .querySelector("[data-bc-level]")
          .setAttribute("data-bc-menu-active", "");
        li.setAttribute("data-bc-menu-active", "");
      } else {
        li.setAttribute("data-bc-menu-active", "");
      }

      if (this.deviceId == 2) {
        li.closest("[data-bc-bp-header-more-container]").classList.remove(
          "active"
        );
      }

      LocalStorageUtil.setCurrentMenu(menuParam.ownerId, node);
    });
    pageLookup.set(node.pid, menuParam);
    li.appendChild(content);
    return li;
  }
  private createExternalMenuItemSingleItem(
    node: IMenuExternalItemInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    key: number
  ): HTMLElement {
    const newMenuParam: IMenuLoaderParam = {
      owner: "external",
      ownerId: node.mid,
      ownerUrl: node.url,
      menuMethod: menuParam.menuMethod,
      rKey: menuParam.rKey,
    };
    const li = document.createElement("li");

    const ul = document.createElement("ul");
    li.setAttribute("data-bc-bp-menu-external-title", "");
    li.setAttribute("data-sys-menu-external", "");
    ul.setAttribute("data-bc-bp-menu-external-single-node", "");
    li.setAttribute("key", String(key));
    li.setAttribute("draggable", String(true));
    li.addEventListener("dragstart", (e) => this.dragStart(e));
    li.addEventListener("dragover", (e) => this.dragOver(e));
    li.addEventListener("drop", (e) => this.drop(e));
    li.appendChild(ul);
    const url = HttpUtil.formatString(
      `${newMenuParam.ownerUrl}${menuParam.menuMethod}`,
      {
        rKey: this.rKey,
        level: menuParam.owner,
      }
    );

    HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
      url,
      "GET",
      this.checkRkeyOption
    ).then((menu) => {
      if (menu) {
        this.createMenu(ul, menu.nodes, newMenuParam, pageLookup, true);
      }
    });
    return li;
  }
  private createExternalMenuItem(
    node: IMenuExternalItemInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    deviceId: number,
    key: number,
    isExternal: boolean
  ): HTMLLIElement {
    const newMenuParam: IMenuLoaderParam = {
      owner: "external",
      ownerId: node.mid,
      ownerUrl: node.url,
      menuMethod: menuParam.menuMethod,
      rKey: menuParam.rKey,
    };
    const li = document.createElement("li");

    const content = document.createElement("a");
    content.setAttribute("data-sys-menu-link", "");
    li.setAttribute("data-bc-bp-menu-external-title", "");
    li.setAttribute("data-sys-menu-external", "");
    content.appendChild(document.createTextNode(node.title));
    li.appendChild(content);
    if (!isExternal) {
      li.setAttribute("key", String(key));
      li.setAttribute("draggable", String(true));
      li.addEventListener("dragstart", (e) => this.dragStart(e));
      li.addEventListener("dragover", (e) => this.dragOver(e));
      li.addEventListener("drop", (e) => this.drop(e));
    }
    li.setAttribute("data-bc-bp-menu-external", "");
    const ul = document.createElement("ul");
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
          (subMenu as HTMLElement).style.maxHeight = "20rem";
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
    const url = HttpUtil.formatString(
      `${newMenuParam.ownerUrl}${menuParam.menuMethod}`,
      {
        rKey: this.rKey,
        level: menuParam.owner,
      }
    );

    HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
      url,
      "GET",
      this.checkRkeyOption
    ).then((menu) => {
      if (menu) {
        this.createMenu(ul, menu.nodes, newMenuParam, pageLookup, true);
      }
    });

    return li;
  }
}
