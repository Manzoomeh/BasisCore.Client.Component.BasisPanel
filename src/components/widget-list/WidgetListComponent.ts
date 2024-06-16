import desktopLayout from "./assets/layout.html";
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
import { Sortable } from "@shopify/draggable";

export default class WidgetListComponent extends BasisPanelChildComponent {
  private readonly _page: IPage;
  private readonly _widgetDialog: Element;

  private widgetList: IWidgetListItemInfo[];
  private sortable: Sortable;
  private isDragging: boolean = false;
  private currentResizeHandle: HTMLElement;
  private startX: number;
  private offsetTop: number;
  private startY: number;
  private startWidth: number;
  private startHeight: number;
  private type: string;
  private widgetsContainer: HTMLElement;
  private onMouseEnter: (e: Event) => void;
  private onMouseLeave: (e: Event) => void;
  dashboardWidgetList: IWidgetListItemInfo[];
  constructor(owner: IUserDefineComponent) {
    super(
      owner,
      desktopLayout,
      desktopLayout,
      "data-bc-bp-widget-list-container"
    );

    this.onMouseEnter = (e) => {
      (e.target as HTMLElement)
        .closest('[data-bc-bp-widget-container="d1"]')
        .setAttribute("draggable", "false");
      this.disableDragDrop();
    };
    this.onMouseLeave = (e) => {
      (e.target as HTMLElement)
        .closest('[data-bc-bp-widget-container="d1"]')
        .setAttribute("draggable", "true");
      this.enableDragDrop();
    };
    this._page = owner.dc.resolve<IPage>("page");
    this._widgetDialog = this.container.querySelector(
      "[data-bc-page-widget-list-dlg]"
    );

    this._page.container.classList.add("drope-zone-container");

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
        await this.saveWidgets();
      });

    this._page.container
      .querySelectorAll("[data-bc-page-widget-list-dlg-btn-add]")
      .forEach((btn) => {
        btn.setAttribute("data-bc-page-widget-list-dlg-btn-add-active", "1");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.displayWidgetList(e);
          if (this._page?.info?.container == "dashboard") {
            this.addingDashboardWidgets();
          }
        });
      });

    this._page.widgetDropAreaContainer.addEventListener("dragenter", (e) =>
      e.preventDefault()
    );
    this._page.widgetDropAreaContainer.addEventListener("dragover", (e) =>
      e.preventDefault()
    );
  }
  private async saveWidgets(): Promise<void> {
    const widgets = document.querySelectorAll("[data-bc-bp-widget-container]");
    const data = [];
    widgets.forEach((e: HTMLElement) => {
      const widgetData = {};
      widgetData["id"] = e.getAttribute("id");
      widgetData["y"] = Math.floor(e.offsetTop / this._page.cell);
      widgetData["x"] = Math.floor(e.offsetLeft / this._page.cell);
      widgetData["h"] = Math.floor(e.offsetHeight / this._page.cell);
      widgetData["w"] = Math.floor(e.offsetWidth / this._page.cell);
      data.push(widgetData);
    });
    const url = HttpUtil.formatString(this.options.method.saveWidgets, {
      rKey: this.options.rKey,
      pageId: this._page.loaderParam.pageId,
    });
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    res = await res.json();
    //@ts-ignore
    if (res.message == "successful") {
      const btn = document.querySelector(
        "[data-bc-page-widget-list-dlg-btn-add]"
      );
      btn.setAttribute("data-icon-left", "");
      btn.removeAttribute("data-icon-right");
      btn.setAttribute("data-bc-page-widget-list-dlg-btn-add-active", "1");
      this.hideList();
    }
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

  // public tryAddingWidget(widgetInfo: IWidgetListItemInfo) {
  // const container = this._page.widgetDropAreaContainer.querySelector(
  //   "[data-bc-widget-drop-area]"
  // ) as HTMLElement;
  // let element = container.querySelector<HTMLElement>(
  //   `[data-bc-widget-id='${widgetInfo.id}']`
  // );
  // if (!element) {
  //   const layout = widgetItemLayout
  //     .replace("@title", widgetInfo.title)
  //     .replace("@id", widgetInfo.id.toString())
  //     .replace(
  //       "@image",
  //       widgetInfo.icon ? widgetInfo.icon : "asset/images/no_icon.png"
  //     );
  //   const widgetMessage = container.querySelector(
  //     "[data-bc-widget-drop-area-message]"
  //   );
  //   if (widgetMessage) widgetMessage.remove();
  //   element = this.owner.toHTMLElement(layout);
  //   container.appendChild(element);
  //   element
  //     .querySelector("[data-bc-btn-remove]")
  //     .addEventListener("click", (x) => {
  //       x.preventDefault();
  //       element.remove();
  //     });
  // }
  // }

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
    this.widgetList = widgetsList;

    try {
      widgetsList.forEach((widget) => {
        const widgetElement = document.createElement("div");
        const container = document.createElement("div");

        const widgetIcon = document.createElement("img");
        widgetElement.setAttribute("draggable", "true");
        widgetElement.setAttribute("id", String(widget.id));
        widgetElement.setAttribute("pallete-widget-element", "");
        widgetIcon.setAttribute(
          "src",
          widget.icon ? widget.icon : "asset/images/no_icon.png"
        );
        container.appendChild(document.createTextNode(widget.title));
        container.appendChild(widgetIcon);
        widgetElement.appendChild(container);

        widgetElement.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify(widget));
        });

        disableWidgets.appendChild(widgetElement);
      });
    } catch { }
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
    document
      .querySelectorAll("[data-bc-bp-widget-container]")
      .forEach((e) => e.setAttribute("draggable", "false"));
    document
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((e: HTMLElement) => {
        e.setAttribute("style", "display:none !important");
      });
    document.querySelectorAll("[data-bc-widget-btn-close]").forEach((el) => {
      el.removeEventListener("mouseenter", this.onMouseEnter);
      el.removeEventListener("mouseleave", this.onMouseLeave);
    });

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
      widgetBox.style.transform = "translateX(330px)";
    } else {
      widgetBox.style.transform = "translateX(-330px)";
    }
    widgetContainer.style.width = "100%";
    this.sortable.destroy();

    this._page.container
      .querySelector('[data-bc-bp-group-container="d1"]')
      .remove();
    this._page.addingPageGroupsAsync(this._page.info);
  }
  disableDragDrop() {
    this.sortable.destroy();
  }
  enableDragDrop() {
    this.widgetsContainer = document.querySelector(
      "[data-bc-bp-group-container]"
    ) as HTMLElement;

    this.sortable = new Sortable(
      [
        this.widgetsContainer,
        document.querySelector(
          "[data-bc-page-widget-disablelist]"
        ) as HTMLElement,
        document.querySelector(
          "[data-bc-page-widget-dashboard-wrapper]"
        ) as HTMLElement,
      ],
      {
        draggable:
          "[pallete-widget-element],[data-bc-bp-widget-container],[data-bc-page-widget-dashboard]",
      }
    );

    let x;
    this.sortable.on("drag:start", (event) => {
      x = event.sensorEvent.clientX;
    });
    this.sortable.on("drag:move", (event) => {
      const { clientX, clientY } = event.sensorEvent;

      if (
        event.source
          .closest("[drop-zone]")
          .attributes.getNamedItem("data-bc-bp-group-container") &&
        event.sourceContainer.attributes.getNamedItem(
          "data-bc-bp-group-container"
        )
      ) {
        if (clientX - x > event.source.offsetWidth / 4) {
          event.source.style.marginRight = "";
          event.source.style.marginLeft = "auto";
        } else if (clientX - x < -event.source.offsetWidth / 4) {
          event.source.style.marginRight = "auto";
          event.source.style.marginLeft = "";
        }
      }
    });

    this.sortable.on("drag:over:container", (event) => {
      if (
        event.overContainer.attributes.getNamedItem(
          "data-bc-page-widget-disablelist"
        ) &&
        event.source.attributes.getNamedItem("pallete-widget-element")
      ) {
        event.source.setAttribute("style", "");
      }

      if (
        event.overContainer.attributes.getNamedItem(
          "data-bc-bp-group-container"
        ) &&
        (event.source.attributes.getNamedItem("pallete-widget-element") ||
          event.source.attributes.getNamedItem("data-bc-page-widget-dashboard"))
      ) {
        let widgetData = this.widgetList.find(
          (e) => String(e.id) === event.source.getAttribute("id")
        );
        if (!widgetData) {
          widgetData = this.dashboardWidgetList.find(
            (e) => String(e.id) === event.source.getAttribute("id")
          );
        }
        event.source.setAttribute("gs-w", widgetData.w.toString());
        event.source.setAttribute("gs-h", widgetData.h.toString());
        event.source.setAttribute("data-bc-bp-widget-container", "");

        const parent = document.querySelector(
          "[data-bc-page-body]"
        ) as HTMLElement;
        event.source.setAttribute(
          "style",
          `display: flex !important;border-radius:24px;outline: 2px solid #ccc;outline-offset: -9px;height:${widgetData.h * this._page.cell
          }px;position:relative;background-color:transparent;justify-content:center;align-items:center;flex-direction:column`
        );
        if (
          event.source.attributes.getNamedItem("data-bc-page-widget-dashboard")
        ) {
        } else {
          event.source.children[0].setAttribute(
            "style",
            `display:flex;justify-content:center;align-items:center;width:100%;height:100%`
          );
        }
      }
    });
    this.sortable.on("drag:stop", (event) => {
      window.removeEventListener("handleMouseMove", () => { });
      if (
        event.sourceContainer.attributes.getNamedItem(
          "data-bc-bp-group-container"
        ) &&
        !event.source
          .closest("[drop-zone]")
          .attributes.getNamedItem("data-bc-bp-group-container")
      ) {
        event.cancel();
        return;
      }
      if (
        event.source
          .closest("[drop-zone]")
          .attributes.getNamedItem("data-bc-bp-group-container") &&
        (event.source.attributes.getNamedItem("pallete-widget-element") ||
          event.source.attributes.getNamedItem("data-bc-page-widget-dashboard"))
      ) {
        let widgetData = this.widgetList.find(
          (e) => String(e.id) === event.source.getAttribute("id")
        );
        if (!widgetData) {
          widgetData = this.dashboardWidgetList.find(
            (e) => String(e.id) === event.source.getAttribute("id")
          );
        }
        event.originalSource.setAttribute("gs-w", widgetData.w.toString());
        event.originalSource.setAttribute("gs-h", widgetData.h.toString());
        event.originalSource.setAttribute(
          "data-bc-bp-direction",
          this.direction
        );
        event.originalSource.querySelector("[data-bc-btn-remove]")?.remove();
        event.originalSource.setAttribute("data-bc-bp-widget-container", "");
        const parent = document.querySelector(
          "[data-bc-page-body]"
        ) as HTMLElement;

        event.originalSource.setAttribute(
          "style",
          event.source.attributes.getNamedItem("style")?.value || ""
        );
        event.originalSource.style.height = `${widgetData.h * this._page.cell
          }px`;

        if (event.source.attributes.getNamedItem("pallete-widget-element")) {
          event.originalSource.children[0].setAttribute(
            "style",
            event.source.children[0].attributes.getNamedItem("style")?.value
          );
        }
        if (!event.originalSource.querySelector("[data-bc-add-height]")) {
          const increaseHeight = document.createElement("div");
          const removeBtn = document.createElement("div");
          removeBtn.innerText = "x";
          removeBtn.setAttribute("data-bc-remove-widget", "");
          removeBtn.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;
            this.disableDragDrop();
          });
          removeBtn.addEventListener("mouseleave", () => {
            this.enableDragDrop();
          });
          removeBtn.addEventListener("mousedown", (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (
              !(
                event.target as HTMLElement
              ).parentElement.attributes.getNamedItem(
                "data-bc-page-widget-dashboard"
              )
            ) {
              const disableWidgets = document.querySelector(
                "[data-bc-page-widget-disableList]"
              );
              const widgetElement = document.createElement("div");
              const container = document.createElement("div");
              const widgetIcon = document.createElement("img");
              const data = this.widgetList.find(
                (e) =>
                  String(e.id) == (event.target as HTMLElement).parentElement.id
              );

              widgetElement.setAttribute("draggable", "true");
              widgetElement.setAttribute("id", String(data.id));
              widgetElement.setAttribute("pallete-widget-element", "");
              widgetIcon.setAttribute(
                "src",
                data.icon ? data.icon : "asset/images/no_icon.png"
              );
              container.appendChild(document.createTextNode(data.title));
              container.appendChild(widgetIcon);
              widgetElement.appendChild(container);

              widgetElement.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify(data));
              });

              disableWidgets.appendChild(widgetElement);
            } else {
              const disableWidgets = document.querySelector(
                "[data-bc-page-widget-dashboard-wrapper]"
              );
              const data = this.dashboardWidgetList.find(
                (e) =>
                  String(e.id) == (event.target as HTMLElement).parentElement.id
              );

              const widgetDiv = document.createElement("div");
              const insideContainer = document.createElement("div");
              insideContainer.setAttribute(
                "data-bc-dashboard-widget-container",
                ""
              );
              const closeDiv = document.createElement("span");
              widgetDiv.setAttribute("data-bc-page-widget-dashboard", "");
              widgetDiv.id = String(data.id);
              widgetDiv.setAttribute("data-sys-text", "");
              closeDiv.setAttribute("data-bc-btn-remove", "");
              closeDiv.textContent = "X";
              insideContainer.textContent = data.title;
              const widgetIcon = document.createElement("img");
              widgetIcon.setAttribute("src", "/asset/images/no_icon.png");
              insideContainer.appendChild(widgetIcon);
              insideContainer.appendChild(closeDiv);
              widgetDiv.appendChild(insideContainer);
              disableWidgets.appendChild(widgetDiv);
              const removewidgetUrl = HttpUtil.formatString(
                this.options.removeFromDashbaord,
                {
                  rKey: this.options.rKey,
                }
              );
              widgetDiv.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify(data));
              });
              closeDiv.addEventListener("click", async (_) => {
                await HttpUtil.checkRkeyFetchDataAsync(
                  removewidgetUrl,
                  "POST",
                  this.options.checkRkey,
                  {
                    //@ts-ignore
                    widgetid: data.widgetid,
                  }
                );
                this.addingDashboardWidgets();
              });
              disableWidgets.appendChild(widgetDiv);
            }

            (event.target as HTMLElement)
              .closest("[data-bc-bp-widget-container]")
              .remove();
            this.enableDragDrop();
          });
          event.originalSource.appendChild(removeBtn);
          event.originalSource.appendChild(increaseHeight);
          const increaseWidth = document.createElement("div");
          event.originalSource.appendChild(increaseWidth);
          increaseHeight.setAttribute("data-bc-add-height", "");
          increaseWidth.setAttribute("data-bc-add-width", "");

          increaseWidth.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;
            this.disableDragDrop();
          });

          increaseWidth.addEventListener("mouseleave", () => {
            this.enableDragDrop();
          });

          increaseWidth.addEventListener("mousedown", (event) =>
            this.handleMouseDown(event)
          );
          increaseHeight.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;
            this.sortable.destroy();
          });

          increaseHeight.addEventListener("mouseleave", () => {
            this.enableDragDrop();
          });

          increaseHeight.addEventListener("mousedown", (event) =>
            this.handleMouseDown(event)
          );

          document.addEventListener("mousemove", (ev) =>
            this.handleMouseMove(ev)
          );
          document.addEventListener("mouseup", (_) => this.handleMouseUp());
        }

        event.originalSource.setAttribute("draggable", "true");
        event.originalSource.setAttribute("class", "widgetDragClass");
      }
      event.originalSource.setAttribute(
        "style",
        event.source.attributes.getNamedItem("style")?.value
      );

      if (
        event.source
          .closest("[drop-zone]")
          .attributes.getNamedItem("data-bc-page-widget-disablelist") &&
        !event.source.attributes.getNamedItem("pallete-widget-element")
      ) {
        event.cancel();
      }
      if (
        event.source
          .closest("[drop-zone]")
          .attributes.getNamedItem("data-bc-page-widget-disablelist") &&
        event.source.attributes.getNamedItem("pallete-widget-element")
      ) {
        event.originalSource.setAttribute("style", "");
        event.originalSource.children[0].setAttribute("style", "");
        event.originalSource.lastChild.remove();
        event.originalSource.removeAttribute("data-bc-bp-widget-container");
      }
    });
  }
  handleMouseMove(ev) {
    if (!this.isDragging) return;

    ev.preventDefault();
    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    let newWidth, newHeight;

    switch (this.type) {
      case "width":
        newWidth = this.startWidth - (ev.clientX - this.startX);

        if (
          newWidth - this.currentResizeHandle.offsetWidth >
          this._page.cell + 10
        ) {
          this.currentResizeHandle.setAttribute(
            "gs-w",
            String(Math.floor(newWidth / this._page.cell) + 1)
          );
        }
        if (
          newWidth - this.currentResizeHandle.offsetWidth <
          -this._page.cell - 10
        ) {
          this.currentResizeHandle.setAttribute(
            "gs-w",
            String(Math.floor(newWidth / this._page.cell) + 1)
          );
        }
        break;
      case "height":
        newHeight = this.startHeight + (ev.clientY - this.startY);
        if (
          newHeight - this.currentResizeHandle.offsetHeight >=
          this._page.cell
        ) {
          this.currentResizeHandle.style.height = `${this.currentResizeHandle.offsetHeight + this._page.cell
            }px`;
        }
        if (
          newHeight - this.currentResizeHandle.offsetHeight <=
          -this._page.cell
        ) {
          this.currentResizeHandle.style.height = `${this.currentResizeHandle.offsetHeight - this._page.cell
            }px`;
        }
        break;
    }
  }
  handleMouseUp() {
    this.isDragging = false;
  }
  handleMouseDown = (ev) => {
    if (ev.srcElement.attributes["data-bc-add-height"]) {
      this.type = "height";
    } else {
      this.type = "width";
    }
    this.isDragging = true;
    this.currentResizeHandle = ev.target.parentElement;
    this.startX = ev.clientX;
    this.offsetTop = ev.target.offsetLeft;

    this.startY = ev.clientY;
    this.startWidth = ev.target.parentElement.offsetWidth;
    this.startHeight = ev.target.parentElement.offsetHeight;
  };

  private showList() {
    document.querySelectorAll("[data-bc-widget-btn-close]").forEach((el) => {
      el.addEventListener("mouseenter", this.onMouseEnter);
      el.addEventListener("mouseleave", this.onMouseLeave);
    });
    const dashbaordBtn = this.container.querySelector(
      ".tabWrapperForWidgets"
    ) as HTMLElement;
    document
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((e: HTMLElement) => {
        e.setAttribute("style", "");
      });
    dashbaordBtn.style.display = "none";
    const widgets = document.querySelectorAll("[data-bc-bp-widget-container]");
    const widgetsContainer = document.querySelector(
      "[data-bc-bp-group-container]"
    ) as HTMLElement;
    widgetsContainer.style.display = "flex";
    widgetsContainer.style.flexWrap = "wrap";
    widgetsContainer.style.flexDirection = "row-reverse";
    widgets.forEach((e: HTMLElement) => {
      const increaseHeight = document.createElement("div");
      const increaseWidth = document.createElement("div");
      e.appendChild(increaseWidth);
      increaseHeight.setAttribute("data-bc-add-height", "");
      increaseWidth.setAttribute("data-bc-add-width", "");
      increaseWidth.addEventListener("mouseenter", () => {
        e.draggable = false;
        this.sortable.destroy();
      });
      increaseWidth.addEventListener("mouseleave", () => {
        this.enableDragDrop();
      });
      increaseWidth.addEventListener("mousedown", (event) =>
        this.handleMouseDown(event)
      );
      e.appendChild(increaseHeight);
      increaseHeight.setAttribute("data-bc-add-height", "");
      increaseHeight.addEventListener("mouseenter", () => {
        e.draggable = false;
        this.sortable.destroy();
      });

      increaseHeight.addEventListener("mouseleave", () => {
        this.enableDragDrop();
      });

      increaseHeight.addEventListener("mousedown", (event) =>
        this.handleMouseDown(event)
      );
      document.addEventListener("mousemove", (ev) => this.handleMouseMove(ev));
      document.addEventListener("mouseup", (_) => this.handleMouseUp());
      e.setAttribute("draggable", "true");
      e.setAttribute("class", "widgetDragClass");
    });
    this.fillWidgetListAsync().then(() => {
      document
        .querySelector("[data-bc-page-widget-disablelist]")
        .setAttribute("drop-zone", "");
      document
        .querySelector("[data-bc-bp-group-container]")
        .setAttribute("drop-zone", "");
      this._widgetDialog.removeAttribute("data-bc-display-none");
    });
    const widgetBox: HTMLElement = this.container.querySelector(
      "[data-bc-page-widget-list]"
    ) as HTMLElement;
    const widgetContainer = document.querySelector(
      "[data-bc-page-body-container]"
    ) as HTMLElement;
    widgetBox.style.transform = "translateX(0px)";
    widgetContainer.style.width = "calc(100% - 330px)";

    this.enableDragDrop();
  }
  public async addingDashboardWidgets(): Promise<void> {
    console.log('heree')
    const dashbaordBtn = this.container.querySelector(
      ".tabWrapperForWidgets"
    ) as HTMLElement;
    dashbaordBtn.style.display = "flex";
    const parent = this.container.querySelector(
      "[data-bc-page-widget-dashboard-wrapper]"
    ) as HTMLElement;
    parent.innerHTML = "";
    console.log('this.options', this.options, this._page)
    const url = HttpUtil.formatString(
      this.options.baseUrl[this._page.loaderParam.owner] + this.options.method.dashboardReservedWidgets,
      {
        rKey: this.options.rKey,
        pid: this._page.loaderParam.pageId
      }
    );
    const removewidgetUrl = HttpUtil.formatString(
      this.options.removeFromDashbaord,
      {
        rKey: this.options.rKey,
      }
    );
    console.log('11111')
    const data = await HttpUtil.fetchStringAsync(url, "GET");
    console.log('22222')

    this.dashboardWidgetList = JSON.parse(data);
    this.dashboardWidgetList?.forEach((widgetList) => {
      const widgetDiv = document.createElement("div");
      const insideContainer = document.createElement("div");
      insideContainer.setAttribute("data-bc-dashboard-widget-container", "");
      const closeDiv = document.createElement("span");
      widgetDiv.setAttribute("data-bc-page-widget-dashboard", "");
      widgetDiv.id = String(widgetList.id);
      widgetDiv.setAttribute("data-sys-text", "");
      closeDiv.setAttribute("data-bc-btn-remove", "");
      closeDiv.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="white"/>
      </svg>`;
      insideContainer.textContent = widgetList.title;
      const widgetIcon = document.createElement("img");
      widgetIcon.setAttribute("src", "/asset/images/no_icon.png");
      insideContainer.appendChild(widgetIcon);
      insideContainer.appendChild(closeDiv);
      widgetDiv.appendChild(insideContainer);
      parent.appendChild(widgetDiv);
      widgetDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(widgetList));
      });
      closeDiv.addEventListener("click", async (_) => {
        await HttpUtil.checkRkeyFetchDataAsync(
          removewidgetUrl,
          "POST",
          this.options.checkRkey,
          {
            //@ts-ignore
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
      ".tabAct"
    ) as HTMLElement;
    console.log('hhhhhhh')
    dashboardWidgetBtn.addEventListener("click", (e) => {
      parent.style.display = "flex";
      allWidget.style.display = "none";
      console.log('moz', `translateX(-${(allWidgetBtn as HTMLElement).offsetLeft - (e.target as HTMLElement).offsetLeft})`)
      activeElement.style.transform = `translateX(-${(allWidgetBtn as HTMLElement).offsetLeft - (e.target as HTMLElement).offsetLeft}px)`;
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
    console.log('dash :>', dashboardWidgetBtn, allWidgetBtn)
  }
}
