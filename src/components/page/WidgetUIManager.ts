import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "./IPage";

export default class WidgetUIManager {
  private _items: Map<number, Element> = new Map<number, Element>();
  private _widgetDialog: Element;
  private owner: IPage;
  constructor(owner: IPage, widgetList: Array<IWidgetInfo>) {
    this.owner = owner;
    this._widgetDialog = owner.content.querySelector(
      "[data-bc-page-widget-dlg]"
    );
    this.hideList();
    owner.content
      .querySelectorAll("[data-bc-page-widget-dlg-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideList();
        })
      );

    this.fillWidgetList(widgetList);
    owner.content
      .querySelectorAll("[data-bc-page-widget-dlg-btn-add]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList();
        })
      );
  }

  private fillWidgetList(widgetList: Array<IWidgetInfo>) {
    const ul = document.querySelector("[data-bc-page-widget-list]");
    widgetList.forEach((widget) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(widget.title));
      ul.appendChild(li);
      this._items.set(widget.id, li);
      li.addEventListener("click", (e) => {
        e.preventDefault();
        this.addWidget(widget);
      });
    });
  }

  private displayWidgetList() {
    this.showList();
  }

  private hideList() {
    this._widgetDialog.setAttribute("data-bc-display-none", "");
  }

  private showList() {
    this._widgetDialog.removeAttribute("data-bc-display-none");
  }

  private addWidget(widgetInfo: IWidgetInfo) {
    this.owner.tryAddingWidget(widgetInfo);
  }

  public widgetAdded(widgetInfo: IWidgetInfo) {
    const element = this._items.get(widgetInfo.id);
    element.setAttribute("data-bc-display-none", "");
  }
  public widgetRemoved(widgetInfo: IWidgetInfo) {
    const element = this._items.get(widgetInfo.id);
    element.removeAttribute("data-bc-display-none");
  }
}
