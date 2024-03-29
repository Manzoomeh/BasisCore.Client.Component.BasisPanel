import { IUserDefineComponent, ISource } from "basiscore";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import PageComponent from "../PageComponent";
import { PageType } from "../PageType";
import HttpUtil from "../../../HttpUtil";
import IPageInfo from "../IPageInfo";
export default class ContainerComponent extends PageComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-page-container");
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

    // const wrapper = this.container;
    // this.container.querySelector("[data-bc-page-widgets-list]")?.addEventListener("click", function (e) {
    //   wrapper.querySelector("[data-bc-page-widgets-list-toggle]").classList.toggle('active');
    // });
  }
  public async addingDashboardWidgets(): Promise<void> {
   

    const nodes = Array.from(this.container.childNodes);
    this.owner.processNodesAsync(nodes);
  
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
