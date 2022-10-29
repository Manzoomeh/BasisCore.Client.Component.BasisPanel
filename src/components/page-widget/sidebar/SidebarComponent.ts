import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent, ISource } from "basiscore";
import { DefaultSource } from "../../../type-alias";
import IMenuInfo, {
  IMenuItemInfo,
  IMenuLevelInfo,
  IMenuPageInfo,
} from "../../menu/IMenuInfo";
import IPageLoaderParam from "../../menu/IPageLoaderParam";
import PageWidgetComponent from "../PageWidgetComponent";

declare const $bc: any;

export default class SidebarComponent extends PageWidgetComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-sidebar-container");
  }

  public runAsync(source?: ISource) {
    return true;
  }

  public async initializeAsync(): Promise<void> {
    this.container.setAttribute("gs-x", this.param.x.toString());
    this.container.setAttribute("gs-y", this.param.y.toString());
    this.container.setAttribute("gs-w", this.param.w.toString());
    this.container.setAttribute("gs-h", this.param.h.toString());

    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    const cell = parent.offsetWidth / 12;

    (this.container as HTMLElement).style.height = `${this.param.h * cell}px`;
    (this.container as HTMLElement).style.top = `${
      this.param.y * cell + parent.offsetTop
    }px`;
    // (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    const mainDiv = this.container.querySelector(
      "[data-bc-sidebar-levels='firstLevel']"
    );

    const url = HttpUtil.formatString(
      `${this.param.page.ownerUrl}${this.options.method.sidebarMenu}`,
      { rKey: this.param.page.rKey, pageId: this.param.page.pageId }
    );

    HttpUtil.checkRkeyFetchDataAsync<IMenuInfo>(
      url,
      "GET",
      this.options.checkRkey
    ).then((sidebar) => {
      this.createSidebar(mainDiv as HTMLElement, sidebar.nodes);
    });
  }

  private createSidebar(div: HTMLElement, items: Array<IMenuItemInfo>) {
    items.forEach((node) => {
      if ((node as IMenuPageInfo).pid) {
        div.appendChild(this.createPageSidebarItem(node as IMenuPageInfo));
      } else if ((node as IMenuLevelInfo).nodes) {
        div.appendChild(this.createLevelSidebarItem(node as IMenuLevelInfo));
      }
    });
  }

  private createLevelSidebarItem(node: IMenuLevelInfo): HTMLElement {
    let subSidebarFlag = false;
    const div = document.createElement("div");
    div.setAttribute("data-bc-sidebar-items", "");
    const content = document.createElement("span");
    content.setAttribute("data-bc-level", "");
    content.appendChild(document.createTextNode(node.title));
    content.setAttribute("data-sys-text", "");
    div.appendChild(content);
    const innerUl = document.createElement("div");
    innerUl.setAttribute("data-bc-sidebar-levels", "secondLevel");
    this.createSidebar(innerUl, node.nodes);
    const active = innerUl.querySelector("[data-bc-sidebar-active]");
    if (active) {
      innerUl.style.opacity = "1";
      innerUl.style.height = "auto";
      content.setAttribute("data-bc-level-open", "");
      subSidebarFlag = true;
    }
    div.appendChild(innerUl);

    div.addEventListener("click", function (e) {
      if (subSidebarFlag == false) {
        innerUl.style.opacity = "1";
        innerUl.style.height = "auto";
        content.setAttribute("data-bc-level-open", "");
        subSidebarFlag = true;
      } else {
        innerUl.style.opacity = "0";
        innerUl.style.height = "0";
        content.removeAttribute("data-bc-level-open");
        subSidebarFlag = false;
      }
    });
    return div;
  }

  private createPageSidebarItem(node: IMenuPageInfo): HTMLElement {
    const div = document.createElement("div");
    div.setAttribute("data-bc-sidebar-items", "");
    if (parseInt(node.pid) === parseInt(this.param.page.pageId)) {
      div.setAttribute("data-bc-sidebar-active", "");
      div.setAttribute("data-sys-inherit", "");
    }
    const content = document.createElement("span");
    content.setAttribute("data-bc-pid", node.pid.toString());
    content.appendChild(document.createTextNode(node.title));
    content.setAttribute("data-sys-text", "");
    content.addEventListener("click", (e) => {
      e.preventDefault();
      this.onSidebarItemClick(node.pid, e.target , this.param.page.arguments);
    });
    div.appendChild(content);
    return div;
  }

  private async onSidebarItemClick(pageId: string, target: EventTarget, args?:any) {
    const newParam: IPageLoaderParam = {
      pageId: pageId,
      owner: this.param.page.owner,
      ownerId: this.param.page.ownerId,
      ownerUrl: this.param.page.ownerUrl,
      rKey: this.param.page.rKey,
      pageMethod: this.param.page.pageMethod,
      arguments: args
    };
    $bc.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  }
}
