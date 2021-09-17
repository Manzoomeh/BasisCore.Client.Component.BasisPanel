import IPageInfo from "./IPageInfo";
import html from "./assets/layout.html";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "./IPage";
import IPageContainer from "../workspace/IPageContainer";
import WidgetUIManager from "./WidgetUIManager";
import WidgetComponent from "../widget/WidgetComponent";
import IWidgetContainer from "./IWidgetContainer";
import IBasisPanelOptions from "../basispanel/IBasisPanelOptions";
import IPageParam from "../menu/IPageParam";
import IWidgetParam from "../widget/IWidgetParam";

export default class PageComponent implements IPage, IWidgetContainer {
  private readonly _pageParam: IPageParam;
  private readonly _owner: IPageContainer;
  public readonly content: Element;
  private readonly _body: HTMLDivElement;
  private readonly widgetUIManager: WidgetUIManager;
  public readonly panelOptions: IBasisPanelOptions;

  constructor(
    owner: IPageContainer,
    pageParam: IPageParam,
    panelOptions: IBasisPanelOptions
  ) {
    this.panelOptions = panelOptions;
    this._pageParam = pageParam;
    this._owner = owner;
    this.content = document.createElement("div");
    this.content.innerHTML = html;
    this._owner.addPageContent(this.content);
    this._body = this.content.querySelector("[data-bc-page-body]");
    if (this._pageParam.pageInfo.content) {
      const range = new Range();
      range.setStart(this._body, 0);
      range.setEnd(this._body, 0);
      range.insertNode(
        range.createContextualFragment(pageParam.pageInfo.content)
      );
    }
    this.widgetUIManager = new WidgetUIManager(
      this,
      pageParam.pageInfo.widgets
    );
  }

  closeWidget(widgetInfo: IWidgetInfo) {
    this.widgetUIManager.widgetRemoved(widgetInfo);
  }

  public tryAddingWidget(widgetInfo: IWidgetInfo) {
    const widgetParam: IWidgetParam = {
      ...widgetInfo,
      ...{
        pageParam: this._pageParam,
        widgetMethod: this.panelOptions.method.widget,
      },
    };
    const widget = new WidgetComponent(this, widgetParam);
    widget.loadAsync();
    this.widgetUIManager.widgetAdded(widgetInfo);
  }

  public addWidgetContent(content: Element) {
    this._body.appendChild(content);
  }
}
