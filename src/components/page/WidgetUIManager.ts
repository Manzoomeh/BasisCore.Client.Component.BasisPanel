import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "./IPage";

export default class WidgetUIManager {
  private _items: Map<number, Element> = new Map<number, Element>();
  private _widgetDialog: Element;
  private owner: IPage;
  constructor(owner: IPage) {
    this.owner = owner;
    this._widgetDialog = owner.container.querySelector(
      "[data-bc-page-widget-dlg]"
    );
    this.hideList();
    owner.container
      .querySelectorAll("[data-bc-page-widget-dlg-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideList();
        })
      );

    // this.fillWidgetList(owner.info.widgets);
    owner.container
      .querySelectorAll("[data-bc-page-widget-dlg-btn-add]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList();
        })
      );
  }

  // private fillWidgetList(widgetList: Array<IWidgetInfo>) {
  //   const disableWidgets = document.querySelector("[data-bc-page-widget-disableList]");
  //   widgetList.forEach((widget) => {
  //     const div = document.createElement("div");
  //     div.appendChild(document.createTextNode(widget.title));
  //     disableWidgets.appendChild(div);
  //     this._items.set(widget.id, div);
  //     div.addEventListener("click", (e) => {
  //       e.preventDefault();
  //       this.addWidget(widget);
  //     });
  //   });
  // }

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
    const element = this._items.get(widgetInfo.id);
    element.setAttribute("data-bc-display-none", "");
  }

  public widgetRemoved(widgetInfo: IWidgetInfo) {
    const element = this._items.get(widgetInfo.id);
    element.removeAttribute("data-bc-display-none");
  }
}
