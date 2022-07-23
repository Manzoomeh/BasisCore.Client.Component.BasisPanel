import { IUserDefineComponent, ISource } from "basiscore";
import layout from "./assets/layout.html";
import PageComponent from "../PageComponent";
import { PageType } from "../PageType";
import HttpUtil from "../../../HttpUtil";
import IPageInfo from "../IPageInfo";
export default class ContainerComponent extends PageComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-page-container");
  }
  public get type(): PageType {
    return PageType.Dashboard;
  }

  public async initializeAsync(): Promise<void> {
    this.loaderParam = JSON.parse(
      await this.owner.getAttributeValueAsync("params")
    );
    const url = HttpUtil.formatString(
      `${this.loaderParam.ownerUrl}${this.loaderParam.pageMethod}`,
      this.loaderParam
    );
    this.info = await HttpUtil.checkRkeyFetchDataAsync<IPageInfo>(
      url,
      "GET",
      this.options.checkRkey
    );
  }
  public async addingDashboardWidgets(): Promise<void> {
    const parent = this.container.querySelector(
      "[data-bc-widget-drop-area-container]"
    );

    const nodes = Array.from(this.container.childNodes);
    this.owner.processNodesAsync(nodes);
    const url = HttpUtil.formatString(this.options.tempwidgets, {
      rKey: this.options.rKey,
    });
    const data = await HttpUtil.fetchStringAsync(url, "GET");
    const content = JSON.parse(data);

    content.forEach((e) => {
      const widgetDiv = document.createElement("div");
      widgetDiv.setAttribute("data-bc-page-widget-dashboard", "");
      widgetDiv.setAttribute("data-sys-widget", "");
      widgetDiv.setAttribute("data-sys-text", "");
      widgetDiv.textContent = e.title;
      const widgetIcon = document.createElement("img");
      widgetIcon.setAttribute("src", "/asset/images/no_icon.png");
      widgetDiv.appendChild(widgetIcon);
      parent.appendChild(widgetDiv);
    });
  }
  public async runAsync(source?: ISource) {
    this.addingDashboardWidgets();
    if (!this._groupsAdded) {
      await this.addingPageGroupsAsync(this.info);
      this._groupsAdded = true;
    }
    return true;
  }
}
