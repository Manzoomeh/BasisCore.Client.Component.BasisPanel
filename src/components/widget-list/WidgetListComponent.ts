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
      .forEach((btn) => {
        btn.setAttribute("data-bc-page-widget-list-dlg-btn-add-active", "1");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList(e);
          if(this._page?.info?.container == "dashboard"){
            this.addingDashboardWidgets()
          }
        });
      });

    this._page.widgetDropAreaContainer.addEventListener("dragenter", (e) =>
      e.preventDefault()
    );
    this._page.widgetDropAreaContainer.addEventListener("dragover", (e) =>
      e.preventDefault()
    );
    this._page.widgetDropAreaContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      this.tryAddingWidget(JSON.parse(e.dataTransfer.getData("text/plain")));
    });
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

      const result = await HttpUtil.checkRkeyFetchDataAsync(
        url,
        "POST",
        this.options.checkRkey,
        {
          widgetId: addedWidgetList,
        }
      );
    }
  }

  public tryAddingWidget(widgetInfo: IWidgetListItemInfo) {
    const container = this._page.widgetDropAreaContainer.querySelector(
      "[data-bc-widget-drop-area]"
    ) as HTMLElement;
    let element = container.querySelector<HTMLElement>(
      `[data-bc-widget-id='${widgetInfo.id}']`
    );

    if (!element) {
      const layout = widgetItemLayout
        .replace("@title", widgetInfo.title)
        .replace("@id", widgetInfo.id.toString())
        .replace(
          "@image",
          widgetInfo.icon ? widgetInfo.icon : "asset/images/no_icon.png"
        );

      const widgetMessage = container.querySelector(
        "[data-bc-widget-drop-area-message]"
      );
      if (widgetMessage) widgetMessage.remove();
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
    // this.addingDashboardWidgets();
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

    const widgetsList = await HttpUtil.checkRkeyFetchDataAsync<
      Array<IWidgetListItemInfo>
    >(url, "GET", this.options.checkRkey);

    try {
      widgetsList.forEach((widget) => {
        const widgetElement = document.createElement("div");
        const widgetIcon = document.createElement("img");
        widgetElement.setAttribute("draggable", "true");
        widgetIcon.setAttribute(
          "src",
          widget.icon ? widget.icon : "asset/images/no_icon.png"
        );
        widgetElement.appendChild(document.createTextNode(widget.title));
        widgetElement.appendChild(widgetIcon);
        widgetElement.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify(widget));
        });

        disableWidgets.appendChild(widgetElement);
        widgetElement.addEventListener("dblclick", (e) => {
          e.preventDefault();
          this.tryAddingWidget(widget);
        });
      });
    } catch {

    }
  }

  private displayWidgetList(e) {
    if (
      e.target.getAttribute("data-bc-page-widget-list-dlg-btn-add-active") ==
      "1"
    ) {
      this.showList();
      e.target.setAttribute("data-icon-right", "");
      e.target.removeAttribute("data-icon-left");
      e.target.removeAttribute("data-bc-page-widget-list-dlg-btn-add-active");
    } else {
      this.hideList();
      e.target.setAttribute("data-icon-left", "");
      e.target.removeAttribute("data-icon-right");
      e.target.setAttribute("data-bc-page-widget-list-dlg-btn-add-active", "1");
    }
  }

  private hideList() {
    this._page.widgetDropAreaContainer.querySelector(
      "[data-bc-widget-drop-area]"
    ).innerHTML = "";
    this.fillWidgetListAsync().then(() => {
      this._page.widgetDropAreaContainer.setAttribute(
        "data-bc-display-none",
        ""
      );
    });
    const widgetBox: HTMLElement = this.container.querySelector(
      "[data-bc-page-widget-list]"
    ) as HTMLElement;
    const widgetContainer = document.querySelector(
      "[data-bc-page-body-container]"
    ) as HTMLElement;
    if (this.direction == "leftToRight") {
      widgetBox.style.transform = "translateX(300px)";
    } else {
      widgetBox.style.transform = "translateX(-300px)";
    }
    widgetContainer.style.width = "100%";
  }

  private showList() {
    const dashbaordBtn = this.container.querySelector(".tabWrapperForWidgets") as HTMLElement
    dashbaordBtn.style.display="none"
    this.fillWidgetListAsync().then(() => {
      this._widgetDialog.removeAttribute("data-bc-display-none");
      this._page.widgetDropAreaContainer.removeAttribute(
        "data-bc-display-none"
      );
    });
    const widgetBox: HTMLElement = this.container.querySelector(
      "[data-bc-page-widget-list]"
    ) as HTMLElement;
    const widgetContainer = document.querySelector(
      "[data-bc-page-body-container]"
    ) as HTMLElement;
    widgetBox.style.transform = "translateX(0px)";
    widgetContainer.style.width = "calc(100% - 300px)";
  }
  public async addingDashboardWidgets(): Promise<void> {
    const dashbaordBtn = this.container.querySelector(".tabWrapperForWidgets") as HTMLElement
    dashbaordBtn.style.display="flex"
    const parent = this.container.querySelector(
      "[data-bc-page-widget-dashboard-wrapper]"
    ) as HTMLElement;
    parent.innerHTML = "";
    const url = HttpUtil.formatString(this.options.tempwidgets, {
      rKey: this.options.rKey,
    });
    const removewidgetUrl = HttpUtil.formatString(
      this.options.removeFromDashbaord,
      {
        rKey: this.options.rKey,
      }
    );
    const data = await HttpUtil.fetchStringAsync(url, "GET");
    const dashboardWidgetList = JSON.parse(data);
    dashboardWidgetList.forEach((widgetList) => {
      const widgetDiv = document.createElement("div");
      const closeDiv = document.createElement("span");
      widgetDiv.setAttribute("data-bc-page-widget-dashboard", "");
      widgetDiv.setAttribute("data-sys-widget", "");
      widgetDiv.setAttribute("data-sys-text", "");
      closeDiv.setAttribute("data-bc-btn-remove", "");
      closeDiv.textContent = "X";
      widgetDiv.textContent = widgetList.title;
      const widgetIcon = document.createElement("img");
      widgetIcon.setAttribute("src", "/asset/images/no_icon.png");
      widgetDiv.appendChild(widgetIcon);
      widgetDiv.appendChild(closeDiv);
      parent.appendChild(widgetDiv);
      widgetDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(widgetList));
      });
      closeDiv.addEventListener("click", async (event) => {
        await HttpUtil.checkRkeyFetchDataAsync(
          removewidgetUrl,
          "POST",
          this.options.checkRkey,
          {
            widgetid: widgetList.widgetid,
          }
        );
        this.addingDashboardWidgets();
      });
    });
    const allWidget = document.querySelector(
      "[data-bc-page-widget-disableList]"
    ) as HTMLElement;
    const allWidgetBtn = this.container.querySelector("[data-all-widget]");
    const dashboardWidgetBtn = this.container.querySelector(
      "[data-dashboard-widgets]"
    );
    const activeElement = this.container.querySelector(
      ".tabActive"
    ) as HTMLElement;
    dashboardWidgetBtn.addEventListener("click", (e) => {
      parent.style.display = "flex";
      allWidget.style.display = "none";
      activeElement.style.transform = `translateX(-100px)`;
      dashboardWidgetBtn.setAttribute("tab-button-status", "active");
      allWidgetBtn.removeAttribute("tab-button-status");
    });
    allWidgetBtn.addEventListener("click", (e) => {
      parent.style.display = "none";
      allWidget.style.display = "flex";
      activeElement.style.transform = `translateX(0px)`;
      allWidgetBtn.setAttribute("tab-button-status", "active");
      dashboardWidgetBtn.removeAttribute("tab-button-status");
    });
  }
}
