import layout from "./assets/layout.html";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "./IPage";
import WidgetUIManager from "./WidgetUIManager";
import IWidgetParam from "../widget/IWidgetParam";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import ISource from "../../basiscore/ISource";
import HttpUtil from "../../HttpUtil";
import { DefaultSource } from "../../type-alias";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import groupLayout from "./assets/group-layout.html";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";

export  default  abstract  class PageComponent
  extends BasisPanelChildComponent
  implements IPage
{
  public loaderParam: IPageLoaderParam;
  public info: IPageInfo;
  public get arguments(): any {
    return this.loaderParam.arguments;
  }
  public abstract  get type():PageType 
  public widgetUIManager: WidgetUIManager;
  public _groupsAdded: boolean = false;
  constructor(owner: IUserDefineComponent , layout :string , dataAttr: string) {
    super(owner, layout, dataAttr);
    this.owner.dc.registerInstance("page", this);
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
    this.widgetUIManager = new WidgetUIManager(this);
    this.owner.addTrigger([DefaultSource.WIDGET_CLOSED]);
  }

  public runAsync(source?: ISource) {
    if (!this._groupsAdded) {
      this.addingGroups(this.info);
      this._groupsAdded = true;
    }
    if (source?.id === DefaultSource.WIDGET_CLOSED) {
      this.widgetUIManager.widgetRemoved(source.rows[0]);
    }
    return true;
  }

  public tryAddingWidget(widgetInfo: IWidgetInfo) {
    const param: IWidgetParam = {
      ...widgetInfo,
      ...{ page: this.loaderParam },
    };
    const paramStr = JSON.stringify(param);
    const command = `<basis core="component.basispanel.widget" run="atclient" param='${paramStr}' ></basis>`;
    const doc = this.owner.toNode(command);
    const nodes = Array.from(doc.childNodes);
    const pageBody = this.container.querySelector('[data-bc-page-body=""]');
    pageBody.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }

  public addingGroups(pageInfo: IPageInfo): void {
    const widgets: Array<IWidgetInfo> = [];
    let maxHeight;
    const pageBody = this.container.querySelector('[data-bc-page-body=""]');
    pageInfo.groups.forEach((group) => {
      group.widgets = group.widgets.map((x) => {
        widgets.push(x);
        return { ...x, ...{ page: this.loaderParam } };
      });
      const command = groupLayout;
      const doc = this.owner.toNode(command) as DocumentFragment;
      const dataMemberName = this.owner.getRandomName(null, ".widgets");
      const optionsName = this.owner.storeAsGlobal(group.options);
      doc
        .querySelector("[data-main-print]")
        .setAttribute("dataMemberName", dataMemberName);
      doc
        .querySelector("[data-main-group]")
        .setAttribute("options", optionsName);
      const nodes = Array.from(doc.childNodes);
      pageBody.appendChild(doc);
      this.owner.processNodesAsync(nodes);
      this.owner.setSource(dataMemberName, group.widgets);
      const cell = (pageBody as HTMLElement).offsetWidth / 12;
      maxHeight = Math.max(...widgets.map((x) => x.y + x.h));
      (pageBody as HTMLElement).style.height = `${cell * maxHeight}px`;
    });
  }
}


