import layout from "./assets/layout.html";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPage from "../page/IPage";
import { IPageGroupInfo } from "../page/IPageGroupInfo";
import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { DefaultSource } from "../../type-alias";

export default class WidgetListComponent extends BasisPanelChildComponent {
  private readonly _page: IPage;
  private readonly _widgetDialog: Element;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-widget-list-container");
    this._page = owner.dc.resolve<IPage>("page");
    this._widgetDialog = this.container.querySelector(
      "[data-bc-page-widget-list-dlg]"
    );
    this.hideList();
    this._page.container
      .querySelectorAll("[data-bc-page-widget-list-dlg-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.hideList();
        })
      );

    this.fillWidgetList(this._page.info.groups);
    this._page.container
      .querySelectorAll("[data-bc-page-widget-list-dlg-btn-add]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList();
        })
      );
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.WIDGET_CLOSED]);
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.WIDGET_CLOSED) {
      this.widgetRemoved(source.rows[0]);
    }
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

  private fillWidgetList(groupList: Array<IPageGroupInfo>) {
    const disableWidgets = document.querySelector(
      "[data-bc-page-widget-disableList]"
    );

    groupList.forEach((group) => {
      const groupLi = document.createElement("li");
      disableWidgets.appendChild(groupLi);
      groupLi.appendChild(document.createTextNode(group.groupName));
      const groupUl = document.createElement("ul");
      groupLi.appendChild(groupUl);
      group.widgets.forEach((widget) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(widget.title));
        groupUl.appendChild(li);
        li.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(widget);
        });
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
    this._page.tryAddingWidget(widgetInfo);
    // const element = this._items.get(widgetInfo.id);
    // element.setAttribute("data-bc-display-none", "");
  }

  public widgetRemoved(widgetInfo: IWidgetInfo) {
    // const element = this._items.get(widgetInfo.id);
    // element.removeAttribute("data-bc-display-none");
  }
}

/*
export default class WidgetListComponent {
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

    this.fillWidgetList(owner.info.groups);
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

  private fillWidgetList(groupList: Array<IPageGroupInfo>) {
    const disableWidgets = document.querySelector(
      "[data-bc-page-widget-disableList]"
    );

    groupList.forEach((group) => {
      const groupLi = document.createElement("li");
      disableWidgets.appendChild(groupLi);
      groupLi.appendChild(document.createTextNode(group.groupName));
      const groupUl = document.createElement("ul");
      groupLi.appendChild(groupUl);
      group.widgets.forEach((widget) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(widget.title));
        groupUl.appendChild(li);
        li.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(widget);
        });
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
    const element = this._items.get(widgetInfo.id);
    element.setAttribute("data-bc-display-none", "");
  }

  public widgetRemoved(widgetInfo: IWidgetInfo) {
    const element = this._items.get(widgetInfo.id);
    element.removeAttribute("data-bc-display-none");
  }
}

*/
