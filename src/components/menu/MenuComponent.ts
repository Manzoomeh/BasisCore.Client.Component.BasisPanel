import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { SourceId } from "../../basiscore/type-alias";
import HttpUtil from "../../HttpUtil";
import IProfileInfo from "../accounting/IProfileInfo";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./assets/layout.html";
import IMenuInfo, {
  IMenuExternalItemInfo,
  IMenuItemInfo,
  IMenuLevelInfo,
  IMenuPageInfo,
} from "./IMenuInfo";
import "./assets/style.css";

export default class MenuComponent extends BasisPanelChildComponent {
  static readonly USER_INFO_SOURCE: SourceId = "basispanel.userinfo";
  readonly ul: HTMLUListElement;
  private profile: IProfileInfo;
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-menu-container");
    this.ul = this.container.querySelector("[data-bc-menu]");
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([MenuComponent.USER_INFO_SOURCE]);
  }

  public async runAsync(source?: ISource) {
    if (source?.id == MenuComponent.USER_INFO_SOURCE) {
      this.profile = source.rows[0];
      await this.loadDataAsync();
    }
  }

  public async loadDataAsync(): Promise<void> {
    const formatter = new Function(
      "rKey",
      "profile",
      `return \`${this.options.profileMenuUrl}\``
    );
    const menuItems = await HttpUtil.getDataAsync<IMenuInfo>(
      formatter(this.options.rKey)
    );
    this.ul.innerHTML = "";
    this.createMenu(this.ul, menuItems.nodes);
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
    HttpUtil.getDataAsync<IMenuInfo>(
      formatter(this.options.rKey, this.profile)
    ).then((menu) => this.createMenu(ul, menu.nodes));
    return li;
  }
}
