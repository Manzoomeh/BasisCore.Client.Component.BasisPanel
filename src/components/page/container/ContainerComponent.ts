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
