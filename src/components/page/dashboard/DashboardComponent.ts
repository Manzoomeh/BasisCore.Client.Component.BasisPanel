import PageComponent from "../PageComponent";
import layout from "./assets/layout.html";
import { IUserDefineComponent, ISource } from "basiscore";
import HttpUtil from "../../../HttpUtil";
import IPageInfo from "../IPageInfo";
import "./assets/style.css";
import { PageType } from "../PageType";

export default class DashboardComponent extends PageComponent {
  public _groupsAdded: boolean = false;
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
    this.info = await HttpUtil.fetchDataAsync<IPageInfo>(url, "GET");
    const body = this.container.querySelector("[data-bc-page-body]");
    const nodes = Array.from(this.container.childNodes);
    this.owner.processNodesAsync(nodes);
  }
 
  public async runAsync(source?: ISource) {
    if (!this._groupsAdded) {
      await this.addingPageGroupsAsync(this.info);
      this._groupsAdded = true;
    }
    return true;
  }
}
