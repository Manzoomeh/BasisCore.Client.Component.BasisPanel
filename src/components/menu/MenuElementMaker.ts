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
    this.createMenu(tmpUL, menuInfo.nodes, menuParam);
    return new MenuElement(menuParam, Array.from(tmpUL.childNodes));
  }

  private createMenu(
    ul: HTMLUListElement,
    items: Array<IMenuItemInfo>,
    menuParam: IMenuLoaderParam
  ) {
    items.forEach((node) => {
      if ((node as IMenuPageInfo).pid) {
        ul.appendChild(
          this.createPageMenuItem(node as IMenuPageInfo, menuParam)
        );
      } else if ((node as IMenuLevelInfo).nodes) {
        ul.appendChild(
          this.createLevelMenuItem(node as IMenuLevelInfo, menuParam)
        );
      } else if ((node as IMenuExternalItemInfo).mid) {
        ul.appendChild(
          this.createExternalMenuItem(node as IMenuExternalItemInfo, menuParam)
        );
      }
    });
  }

  private createLevelMenuItem(
    node: IMenuLevelInfo,
    menuParam: IMenuLoaderParam
  ): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-level", "");
    content.appendChild(document.createTextNode(node.title));
    const innerUl = document.createElement("ul");
    innerUl.setAttribute("data-bc-bp-submenu", "");
    this.createMenu(innerUl, node.nodes, menuParam);
    li.appendChild(content);
    li.appendChild(innerUl);
    let subMenuFlag = false;
    li.addEventListener("click", function (e) {
      if (subMenuFlag == false) {
        innerUl.style.transition = "all 0.3s ease-in-out";
        innerUl.style.height = `${innerUl.scrollHeight}px`;
        content.setAttribute("data-bc-level-open", "");
        subMenuFlag = true;
      } else {
        innerUl.style.transition = "all 0.3s ease-in-out";
        innerUl.style.height = "0";
        content.removeAttribute("data-bc-level-open");
        subMenuFlag = false;
      }
    });
    return li;
  }

  private createPageMenuItem(
    node: IMenuPageInfo,
    menuParam: IMenuLoaderParam
  ): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-pid", node.pid.toString());
    content.appendChild(document.createTextNode(node.title));
    content.addEventListener("click", (e) => {
      e.preventDefault();
      this.onMenuItemClick(node.pid, menuParam, e.target);
    });
    li.appendChild(content);
    return li;
  }

  private createExternalMenuItem(
    node: IMenuExternalItemInfo,
    menuParam: IMenuLoaderParam
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
      }
    );
    HttpUtil.getDataAsync<IMenuInfo>(url).then((menu) =>
      this.createMenu(ul, menu.nodes, newMenuParam)
    );
    return li;
  }
}
