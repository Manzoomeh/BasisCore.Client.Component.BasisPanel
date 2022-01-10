import PageComponent from "../page/PageComponent";
import layout from "./assets/layout.html";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import HttpUtil from "../../HttpUtil";
import IPageInfo from "../page/IPageInfo";
import WidgetUIManager from "../page/WidgetUIManager";
import { DefaultSource } from "../../type-alias";
import ISource from "../../basiscore/ISource";
import "./assets/style.css";
import { PageType } from "../page/PageType";


export default class DashboardComponent
  extends PageComponent {
	public widgetUIManager: WidgetUIManager;
	public _groupsAdded: boolean = false;
	constructor(owner: IUserDefineComponent) {
		super(owner, layout, "data-bc-bp-page-container");
	  }
	public   get type():PageType {
		return PageType.Dashboard
	}
	// public async initializeAsync(): Promise<void> {

	// 	const a = this.owner.addTrigger(["db.dashboard_inactive_widget"]);
	// 	console.log(a)
	// }
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
		this.widgetUIManager = new WidgetUIManager(this);
		this.owner.addTrigger([DefaultSource.WIDGET_CLOSED]);
		// this.owner.addTrigger(["db.dashboard_inactive_widget"]);
	  }
	  public addingDashboardWidgets(): void {
		const nodes = Array.from(this.container.childNodes);
      	this.owner.processNodesAsync(nodes);
	  }
	  public runAsync(source?: ISource) {
		  this.addingDashboardWidgets()
		if (!this._groupsAdded) {
		  this.addingGroups(this.info);
		  this._groupsAdded = true;
		}
		if (source?.id === DefaultSource.WIDGET_CLOSED) {
		  this.widgetUIManager.widgetRemoved(source.rows[0]);
		}
		return true;
	  }
}


