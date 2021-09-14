import IPageInfo from "./IPageInfo";
import html from "./assets/layout.html";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "./IPage";
import IPageContainer from "../workspace/IPageContainer";
import WidgetUIManager from "./WidgetUIManager";
import WidgetComponent from "../widget/WidgetComponent";
import IWidgetContainer from "./IWidgetContainer";

export default class PageComponent implements IPage, IWidgetContainer {
  private readonly _pageInfo: IPageInfo;
  private readonly _owner: IPageContainer;
  public readonly content: Element;
  private readonly _body: HTMLDivElement;
  private readonly widgetUIManager: WidgetUIManager;

  constructor(owner: IPageContainer, pageInfo: IPageInfo) {
    this._pageInfo = pageInfo;
    this._owner = owner;
    this.content = document.createElement("div");
    this.content.innerHTML = html;
    this._owner.addPageContent(this.content);
    this._body = this.content.querySelector("[data-bc-page-body]");
    if (this._pageInfo.content) {
      const range = new Range();
      range.setStart(this._body, 0);
      range.setEnd(this._body, 0);
      range.insertNode(range.createContextualFragment(pageInfo.content));
    }
    this.widgetUIManager = new WidgetUIManager(this, pageInfo.widgets);
  }

  closeWidget(widgetInfo: IWidgetInfo) {
    this.widgetUIManager.widgetRemoved(widgetInfo);
  }

  public tryAddingWidget(widgetInfo: IWidgetInfo) {
    const widget = new WidgetComponent(this, widgetInfo);
    this.widgetUIManager.widgetAdded(widgetInfo);
  }
  public addWidgetContent(content: Element) {
    this._body.appendChild(content);
  }
}
