import layout from "./assets/layout.html";
import dropAreaLayout from "./assets/drop-area-layout.html";
import widgetItemLayout from "./assets/widget-item-layout.html";
import "./assets/style.css";
import IWidgetInfo from "../page-widget/widget/IWidgetInfo";
import IPage from "../page/IPage";
import { ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { DefaultSource } from "../../type-alias";
import HttpUtil from "../../HttpUtil";
import IWidgetListItemInfo from "../page-widget/widget/IWidgetListItemInfo";

export default class WidgetListComponent extends BasisPanelChildComponent {
  private readonly _page: IPage;
  private readonly _widgetDialog: Element;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-widget-list-container");
    this._page = owner.dc.resolve<IPage>("page");
    this._widgetDialog = this.container.querySelector(
      "[data-bc-page-widget-list-dlg]"
    );
    this._page.widgetDropAreaContainer.innerHTML = dropAreaLayout;
    this._page.container
      .querySelectorAll("[data-bc-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideList();
        })
      );
    this._page.container
      .querySelector("[data-bc-page-widget-save-setting]")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        await this.sendSelectedWidgetToServerAsync();
        this.hideList();
      });

    this._page.container
      .querySelectorAll("[data-bc-page-widget-list-dlg-btn-add]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList();
        })
      );

    this._page.widgetDropAreaContainer.addEventListener("dragenter", (e) =>
      e.preventDefault()
    );
    this._page.widgetDropAreaContainer.addEventListener("dragover", (e) =>
      e.preventDefault()
    );
    this._page.widgetDropAreaContainer.addEventListener("drop", (e) =>
      this.tryAddingWidget(JSON.parse(e.dataTransfer.getData("text/plain")))
    );
  }

  private async sendSelectedWidgetToServerAsync(): Promise<void> {
    const addedWidgetList = Array.from(
      this._page.widgetDropAreaContainer.querySelectorAll("[data-bc-widget-id]")
    ).map((x) => x.getAttribute("data-bc-widget-id"));
    if (addedWidgetList.length > 0) {
      const url = HttpUtil.formatString(this.options.widgetListUrl, {
        rKey: this.options.rKey,
        pageId: this._page.loaderParam.pageId,
      });
      const result = await HttpUtil.fetchDataAsync(url, "POST", {
        widgetId: addedWidgetList,
      });
    }
  }

  public tryAddingWidget(widgetInfo: IWidgetListItemInfo) {
    const container = this._page.widgetDropAreaContainer.querySelector(
      "[data-bc-widget-drop-area]"
    );
    let element = container.querySelector<HTMLElement>(
      `[data-bc-widget-id='${widgetInfo.id}']`
    );

    if (!element) {
      const layout = widgetItemLayout
        .replace("@title", widgetInfo.title)
        .replace("@id", widgetInfo.id.toString());
      element = this.owner.toHTMLElement(layout);
      container.appendChild(element);
      element
        .querySelector("[data-bc-btn-remove]")
        .addEventListener("click", (x) => {
          x.preventDefault();
          element.remove();
        });
    }
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.WIDGET_CLOSED]);
    return Promise.resolve();
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.WIDGET_CLOSED) {
    }
  }

  private async fillWidgetListAsync(): Promise<void> {
    const disableWidgets = document.querySelector(
      "[data-bc-page-widget-disableList]"
    );
    disableWidgets.innerHTML = "";

    const url = HttpUtil.formatString(this.options.widgetListUrl, {
      rKey: this.options.rKey,
      pageId: this._page.loaderParam.pageId,
    });

    const widgetsList = await HttpUtil.fetchDataAsync<
      Array<IWidgetListItemInfo>
    >(url, "GET");
    widgetsList.forEach((widget) => {
      const widgetElement = document.createElement("div");
      widgetElement.setAttribute("draggable", "true");
      widgetElement.appendChild(document.createTextNode(widget.title));
      widgetElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(widget));
      });
      disableWidgets.appendChild(widgetElement);
      widgetElement.addEventListener("dblclick", (e) => {
        e.preventDefault();
        this.tryAddingWidget(widget);
      });
    });
  }

  private displayWidgetList() {
    this.showList();
  }

  private hideList() {
    this._page.widgetDropAreaContainer.querySelector(
      "[data-bc-widget-drop-area]"
    ).innerHTML = "";
    this._widgetDialog.setAttribute("data-bc-display-none", "");
    this._page.widgetDropAreaContainer.setAttribute("data-bc-display-none", "");
  }

  private showList() {
    this.fillWidgetListAsync().then(() => {
      this._widgetDialog.removeAttribute("data-bc-display-none");
      this._page.widgetDropAreaContainer.removeAttribute(
        "data-bc-display-none"
      );
    });
  }
}
