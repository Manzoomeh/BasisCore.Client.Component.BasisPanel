import PageComponent from "../PageComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { IUserDefineComponent, ISource } from "basiscore";
import HttpUtil from "../../../HttpUtil";
import IPageInfo from "../IPageInfo";
import { PageType } from "../PageType";
import WorkspaceComponent from "../../workspace/WorkspaceComponent";
import LocalStorageUtil from "../../../LocalStorageUtil";
import { IPageGroupInfo } from "../IPageGroupInfo";

export default class DashboardComponent extends PageComponent {
  public _groupsAdded: boolean = false;
  private _banner = LocalStorageUtil.getLastBanner();
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-page-container");
  }
  public get type(): PageType {
    return PageType.Dashboard;
  }
  public async initializeAsync(): Promise<void> {
    super.initializeAsync();
    const body = this.container.querySelector("[data-bc-page-body]");
    const nodes = Array.from(this.container.childNodes);
    this.owner.processNodesAsync(nodes);

    // const wrapper = this.container;
    // this.container.querySelector("[data-bc-page-widgets-list]")?.addEventListener("click", function (e) {
    //   wrapper.querySelector("[data-bc-page-widgets-list-toggle]").classList.toggle('active');
    // });
  }
  public addBannerToPage(group: IPageGroupInfo) {
    const maxY = Math.max(...group.widgets.map((e) => e.y + e.h));
    this.info.groups.forEach((g) => {
      g.widgets.forEach((w) => {
        w.y = w.y + maxY;
      });
    });
    this.info.groups.push(group)
  }
  public async runAsync(source?: ISource) {
    if (!this._groupsAdded) {
      const last_state = JSON.parse(
        localStorage.getItem("__bc_panel_last_state__")
      );
      const level = last_state?.p?.owner;
      if (level == "business") {
        if (this._banner) {
          if (this.options.rKey == this._banner.rkey) {
            console.log('this._banner.closedWidgets', this._banner.closedWidgets)
            if (this._banner.group.widgets.find(e => !this._banner.closedWidgets.includes(e.id))) {
              this.addBannerToPage(this._banner.group);
            }
          } else {
            const url = HttpUtil.formatString(
              this.options.baseUrl.business + this.options.bannerUrl,
              { rKey: this.options.rKey }
            );
            const res = await HttpUtil.fetchDataAsync<any>(url, "GET");
            if (res.eventID == this._banner.eventID) {
              if (this._banner.group.widgets.find(e => !this._banner.closedWidgets.includes(e.id))) {
                this.addBannerToPage(this._banner.group);
              }
            } else {
              LocalStorageUtil.setLastBanner(this.options.rKey,
                res.eventID,
                res.groups[0]
              );
              this.addBannerToPage(res.groups[0]);
            }
          }
        } else {
          const url = HttpUtil.formatString(
            this.options.baseUrl.business + this.options.bannerUrl,
            { rKey: this.options.rKey }
          );
          const res = await HttpUtil.fetchDataAsync<any>(url, "GET");

          LocalStorageUtil.setLastBanner(this.options.rKey, res.eventID,

            res.groups[0],
          );
          this.addBannerToPage(res.groups[0]);
        }
      }
      await this.addingPageGroupsAsync(this.info);
      this._groupsAdded = true;
    }
    return true;
  }
}
