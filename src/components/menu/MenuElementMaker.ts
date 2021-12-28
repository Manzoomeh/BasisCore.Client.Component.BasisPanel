import HttpUtil from "../../HttpUtil";
import IMenuInfo, {
  IMenuLevelInfo,
  IMenuPageInfo,
  IMenuExternalItemInfo,
  IMenuItemInfo,
  IMenuLoaderParam,
} from "./IMenuInfo";
import MenuElement from "./MenuElement";

export default class MenuElementMaker {
  readonly rKey: string;
  readonly onMenuItemClick: (
    pageId: string,
    param: IMenuLoaderParam,
    target: EventTarget
  ) => void;

  constructor(
    rKey: string,
    onMenuItemClick: (
      pageId: string,
      param: IMenuLoaderParam,
      target: EventTarget
    ) => void
  ) {
    this.rKey = rKey;
    this.onMenuItemClick = onMenuItemClick;
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
    pageLookup: Map<string, IMenuLoaderParam>
  ) {
    items.forEach((node) => {
      if ((node as IMenuPageInfo).pid) {
        ul.appendChild(
          this.createPageMenuItem(node as IMenuPageInfo, menuParam, pageLookup)
        );
      } else if ((node as IMenuLevelInfo).nodes) {
        ul.appendChild(
          this.createLevelMenuItem(
            node as IMenuLevelInfo,
            menuParam,
            pageLookup
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
            pageLookup
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
            pageLookup
          )
        );
      }
    });
  }

  private createLevelMenuItem(
    node: IMenuLevelInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>
  ): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-level", "");
    content.appendChild(document.createTextNode(node.title));
    const innerUl = document.createElement("ul");
    innerUl.setAttribute("data-bc-bp-submenu", "");
    this.createMenu(innerUl, node.nodes, menuParam, pageLookup);
    li.appendChild(content);
    li.appendChild(innerUl);
    let subMenuFlag = false;
    li.addEventListener("click", function (e) {
      if (subMenuFlag == false) {
        innerUl.style.transform = ` scaleY(1)`;
        content.setAttribute("data-bc-level-open", "");
        subMenuFlag = true;
      } else {
        innerUl.style.transform = ` scaleY(0)`;
        content.removeAttribute("data-bc-level-open");
        subMenuFlag = false;
      }
    });
    return li;
  }

  private createPageMenuItem(
    node: IMenuPageInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>
  ): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-pid", node.pid.toString());
    console.log("aaa",node.title)
    content.appendChild(document.createTextNode(node.title));
    content.addEventListener("click", (e) => {
      e.preventDefault();
      this.onMenuItemClick(node.pid, menuParam, e.target);
    });
    pageLookup.set(node.pid, menuParam);
    li.appendChild(content);
    return li;
  }
  private createExternalMenuItemSingleItem(
    node: IMenuExternalItemInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>
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
    ul.setAttribute("data-bc-bp-menu-external-single-node", "");
    li.appendChild(ul);
    let subMenuFlag = false;
    const url = HttpUtil.formatString(
      `${newMenuParam.ownerUrl}${menuParam.menuMethod}`,
      {
        rKey: this.rKey,
        level: menuParam.owner,
      }
    );

    HttpUtil.fetchDataAsync<IMenuInfo>(url, "GET").then((menu) => {
      this.createMenu(ul, menu.nodes, newMenuParam, pageLookup);
    });
    return li;
  }
  private createExternalMenuItem(
    node: IMenuExternalItemInfo,
    menuParam: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>
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
    console.log("aaaa",node.title)
    li.setAttribute("data-bc-bp-menu-external-title","")
    content.appendChild(document.createTextNode(node.title));
    li.appendChild(content);
    const ul = document.createElement("ul");
    ul.setAttribute("data-bc-bp-menu-external", "");
    content.setAttribute("data-bc-bp-menu-external-level", "");
    li.appendChild(ul);
    let subMenuFlag = false;
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
    const url = HttpUtil.formatString(
      `${newMenuParam.ownerUrl}${menuParam.menuMethod}`,
      {
        rKey: this.rKey,
        level: menuParam.owner,
      }
    );
    HttpUtil.fetchDataAsync<IMenuInfo>(url, "GET").then((menu) =>
      this.createMenu(ul, menu.nodes, newMenuParam, pageLookup)
    );
    return li;
  }
}
