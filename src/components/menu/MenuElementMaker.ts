import HttpUtil from "../../HttpUtil";
import IProfileInfo from "../accounting/IProfileInfo";
import IMenuInfo, {
  IMenuLevelInfo,
  IMenuPageInfo,
  IMenuExternalItemInfo,
  IMenuItemInfo,
  IMenuLoaderParam,
} from "./IMenuInfo";
import MenuElement from "./MenuElement";

export default class MenuElementMaker {
  private readonly rKey: string;
  private readonly profile: IProfileInfo;
  constructor(rKey: string, profile: IProfileInfo) {
    this.rKey = rKey;
    this.profile = profile;
  }

  public create(menuInfo: IMenuInfo, menuParam: IMenuLoaderParam): MenuElement {
    const tmpUL = document.createElement("ul");
    this.createMenu(tmpUL, menuInfo.nodes);
    return new MenuElement(menuParam, Array.from(tmpUL.childNodes));
  }

  private createMenu(ul: HTMLUListElement, items: Array<IMenuItemInfo>) {
    items.forEach((node) => {
      if ((node as IMenuPageInfo).pid) {
        ul.appendChild(this.createPageMenuItem(node as IMenuPageInfo));
      } else if ((node as IMenuLevelInfo).nodes) {
        ul.appendChild(this.createLevelMenuItem(node as IMenuLevelInfo));
      } else if ((node as IMenuExternalItemInfo).mid) {
        ul.appendChild(
          this.createExternalMenuItem(node as IMenuExternalItemInfo)
        );
      }
    });
  }
  private createLevelMenuItem(node: IMenuLevelInfo): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-level", "");
    content.appendChild(document.createTextNode(node.title));
    const innerUl = document.createElement("ul");
    this.createMenu(innerUl, node.nodes);
    li.appendChild(content);
    li.appendChild(innerUl);
    return li;
  }

  private createPageMenuItem(node: IMenuPageInfo): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.setAttribute("data-bc-pid", node.pid.toString());
    content.appendChild(document.createTextNode(node.title));
    li.appendChild(content);
    return li;
  }

  private createExternalMenuItem(node: IMenuExternalItemInfo): HTMLLIElement {
    const li = document.createElement("li");
    const content = document.createElement("a");
    content.appendChild(document.createTextNode(node.title));
    li.appendChild(content);
    const ul = document.createElement("ul");
    li.appendChild(ul);
    const formatter = new Function("rKey", "profile", `return \`${node.url}\``);
    HttpUtil.getDataAsync<IMenuInfo>(formatter(this.rKey, this.profile)).then(
      (menu) => this.createMenu(ul, menu.nodes)
    );
    return li;
  }
}
