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
      .forEach((btn) =>{
        btn.setAttribute("data-bc-page-widget-list-dlg-btn-add-active","1")
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.displayWidgetList(e);
        })
      });

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
    ) as HTMLElement
    let element = container.querySelector<HTMLElement>(
      `[data-bc-widget-id='${widgetInfo.id}']`
    );
   
    if (!element) {
      const layout = widgetItemLayout
        .replace("@title", widgetInfo.title)
        .replace("@id", widgetInfo.id.toString())
        .replace("@image", widgetInfo.icon);
      const widgetMessage = container.querySelector("[data-bc-widget-drop-area-message]")
      if(widgetMessage)
        widgetMessage.remove()
        // console.log("ssss",container.querySelector("[data-bc-widget-drop-area-message]"))
      // const widgetIcon = document.createElement("img")
      // widgetIcon.setAttribute("src","/asset/images/no_icon.png")
      // layout.appendChild(widgetIcon)
      // element = this.owner.toHTMLElement(layout);
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
    
    try{
      widgetsList.forEach((widget) => {
        const widgetElement = document.createElement("div");
        const widgetIcon = document.createElement("img")
        widgetElement.setAttribute("draggable", "true");
        widgetIcon.setAttribute("src" , widget.icon ? widget.icon : "asset/images/no_icon.png")
        widgetElement.appendChild(document.createTextNode(widget.title));
        widgetElement.appendChild(widgetIcon)
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
    catch{
      
    }
    
  }

  private displayWidgetList(e ) {
    if(e.target.getAttribute("data-bc-page-widget-list-dlg-btn-add-active") == "1"){
      this.showList();
      e.target.setAttribute("data-icon-right" , "")
      e.target.removeAttribute("data-icon-left" )
      e.target.removeAttribute("data-bc-page-widget-list-dlg-btn-add-active")

    }
    else{
      this.hideList();
      e.target.setAttribute("data-icon-left" , "")
      e.target.removeAttribute("data-icon-right" )
      e.target.setAttribute("data-bc-page-widget-list-dlg-btn-add-active","1")
    }
    
  }

  private hideList() {
    this._page.widgetDropAreaContainer.querySelector(
      "[data-bc-widget-drop-area]"
    ).innerHTML = "";
    this.fillWidgetListAsync().then(() => {
      this._page.widgetDropAreaContainer.setAttribute(
        "data-bc-display-none",""
      );
    });  
    const widgetBox : HTMLElement= this.container.querySelector("[data-bc-page-widget-list]") as HTMLElement
    const widgetContainer = document.querySelector("[data-bc-page-body-container]") as HTMLElement
    const widgetDashboardBox = document.querySelector("[data-bc-dashboard-widgets]") as HTMLElement
    widgetBox.style.transform="translateX(-300px)"
    widgetContainer.style.width="calc(100%)"
    widgetDashboardBox.style.width="calc(100% )"
  }

  private showList() {
    this.fillWidgetListAsync().then(() => {
      this._widgetDialog.removeAttribute("data-bc-display-none");
      this._page.widgetDropAreaContainer.removeAttribute(
        "data-bc-display-none"
      );
    });    
    const widgetBox : HTMLElement= this.container.querySelector("[data-bc-page-widget-list]") as HTMLElement
    const widgetContainer = document.querySelector("[data-bc-page-body-container]") as HTMLElement
    const widgetDashboardBox = document.querySelector("[data-bc-dashboard-widgets]") as HTMLElement
    widgetBox.style.transform="translateX(0px)"
    widgetContainer.style.width="calc(100% - 300px)"
    widgetDashboardBox.style.width="calc(100% - 300px)"

  }
}
