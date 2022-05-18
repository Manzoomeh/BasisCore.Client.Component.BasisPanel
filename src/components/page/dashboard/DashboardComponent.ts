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
    if (this.info.content) {
      const range = new Range();
      range.setStart(body, 0);
      range.setEnd(body, 0);
      range.insertNode(range.createContextualFragment(this.info.content));
    }
  }
  public async addingDashboardWidgets(): Promise<void>  {
    const parent = this.container.querySelector("[data-bc-page-widget-dashboard-wrapper]")
    const widgetWrapper = this.container.querySelector("[data-bc-page-dashboard-disablelist]") as HTMLElement
    const nodes = Array.from(this.container.childNodes);
    this.owner.processNodesAsync(nodes);
    const url = HttpUtil.formatString( this.options.tempwidgets, {
      rKey: this.options.rKey,
    }); 
    const data = await HttpUtil.fetchStringAsync( url, "GET" );
    const content = JSON.parse(data)
    content.forEach((e) => {
      const widgetDiv = document.createElement("div")
      widgetDiv.setAttribute("data-bc-page-widget-dashboard","")
      widgetDiv.setAttribute("data-sys-widget","")
      widgetDiv.setAttribute("data-sys-text","")
      widgetDiv.textContent= e.title
      const widgetIcon = document.createElement("img")
      widgetIcon.setAttribute("src" , "/asset/images/no_icon.png")
      widgetDiv.appendChild(widgetIcon)
      parent.appendChild(widgetDiv)
      widgetWrapper.style.display="block"
    })
   
    

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
