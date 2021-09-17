import IPageInfo from "./IPageInfo";
import html from "./assets/layout.html";
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

export default class PageComponent
  extends BasisPanelChildComponent
  implements IPage
{
  public loaderParam: IPageLoaderParam;
  public info: IPageInfo;
  private widgetUIManager: WidgetUIManager;

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-page-container");
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
    this.container.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }
}
