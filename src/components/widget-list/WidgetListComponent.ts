import desktopLayout from "./assets/layout.html";

import "./assets/style.css";
import IPage from "../page/IPage";
import { ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { DefaultSource } from "../../type-alias";
import HttpUtil from "../../HttpUtil";
import IWidgetListItemInfo from "../page-widget/widget/IWidgetListItemInfo";
import { Sortable } from "@shopify/draggable";
import IDashboardCategoryData from "../page-widget/widget/IDashboardcategoryData";
import IDashboardWidgetData from "../page-widget/widget/IDashboardWidgetData";

export default class WidgetListComponent extends BasisPanelChildComponent {
  private readonly _page: IPage;
  private readonly _widgetDialog: Element;

  private widgetList: IWidgetListItemInfo[];
  private disabledWidgetList: IWidgetListItemInfo[] = [];
  private disabledDashboardWidgetList: IDashboardWidgetData[] = [];
  private sortable: Sortable;
  private isDragging: boolean = false;
  private currentResizeHandle: HTMLElement;
  private startX: number;
  private selectedTag: string = '0'
  private offsetTop: number;
  private searchParam: string = ''
  private tabIndex = 0
  private startY: number;
  private startWidth: number;
  private startHeight: number;
  private type: string;
  private widgetsContainer: HTMLElement;
  private tags: IDashboardCategoryData[]
  private onMouseEnter: (e: Event) => void;
  private onMouseLeave: (e: Event) => void;
  dashboardWidgetList: IDashboardWidgetData[];
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
    console.log(`this.container.querySelector('[data-bc-page-widget-search-input]')`, this.container.querySelector('[data-bc-page-widget-search-input]'))
    this._widgetDialog.querySelector('[data-bc-page-widget-search-input]').addEventListener('input', (e) => {

      this.searchParam = (e.target as HTMLInputElement).value
      console.log('mozmoz', (e.target as HTMLInputElement).value)
      if (this.tabIndex == 0) {

        this.fillListUI()
      } else {
        this.fillDashboardWidgets()
      }
      console.log('this.searchParam', this.searchParam)
    })
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
    const data = { data: [] };
    widgets.forEach((e: HTMLElement) => {
      const widgetData = {};
      widgetData["widgetid"] = e.getAttribute("id");
      widgetData["y"] = Math.floor(e.offsetTop / this._page.cell);
      widgetData["x"] = Math.floor(e.offsetLeft / this._page.cell);
      widgetData["h"] = Math.floor(e.offsetHeight / this._page.cell);
      widgetData["w"] = Math.floor(e.offsetWidth / this._page.cell);
      console.log('first', this._page)
      widgetData["moduleid"] = Number(e.getAttribute("moduleid")) || 1
      data.data.push(widgetData);
    });
    const url = HttpUtil.formatString(this.options.baseUrl.corporate + this.options.method.saveWidgets, {
      rkey: this.options.rKey,
      pid: this._page.loaderParam.pageId,
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
        pid: this._page.loaderParam.pageId,
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
  //   `[data - bc - widget - id= '${widgetInfo.id}']`
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


    const url = HttpUtil.formatString(this.options.widgetListUrl, {
      rKey: this.options.rKey,
      pid: this._page.loaderParam.pageId,
    });

    const widgetsList = await HttpUtil.checkRkeyFetchDataAsync<
      Array<IWidgetListItemInfo>
    >(url, "GET", this.options.checkRkey);
    this.widgetList = widgetsList;
    this.disabledWidgetList = widgetsList
    this.fillListUI()

  }
  fillListUI() {
    const disableWidgets = document.querySelector(
      "[data-bc-page-widget-disableList]"
    );
    disableWidgets.innerHTML = "";
    try {
      this.disabledWidgetList.filter(e => e.title.includes(this.searchParam)).forEach((widget) => {
        const widgetElement = document.createElement("div");
        const container = document.createElement("div");

        const widgetIcon = document.createElement("img");
        widgetElement.setAttribute("draggable", "true");
        widgetElement.setAttribute("id", String(widget.id));
        widgetElement.setAttribute("pallete-widget-element", "");
        widgetIcon.setAttribute(
          "src",
          widget.icon ? widget.icon : `data:image/svg+xml;utf8,<svg width="116" height="70" viewBox="0 0 116 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="116" height="70" rx="5" fill="#E4E7F4"/>
<mask id="mask0_12273_103335" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="116" height="70">
<rect width="116" height="70" rx="5" fill="#E4E7F4"/>
</mask>
<g mask="url(#mask0_12273_103335)">
<path d="M112.749 26.3801L121.932 40.721L107.591 49.9042L98.4076 35.5633L112.749 26.3801ZM79.9424 21.3886L76.2583 38.1915L59.4553 34.5074L63.1394 17.7045L79.9424 21.3886ZM112.739 72.6062L109.055 89.4091L92.2524 85.725L95.9365 68.9221L112.739 72.6062ZM115.327 14.618L86.2255 32.8923L104.92 62.0863L89.3771 58.6786L82.0089 92.2844L115.615 99.6526L122.983 66.0468L104.92 62.0863L133.694 43.2999L115.327 14.618ZM90.1859 14.8292L56.58 7.46096L49.2118 41.0668L82.8177 48.435L90.1859 14.8292ZM70.7321 63.3959L67.048 80.1989L50.2451 76.5148L53.9292 59.7118L70.7321 63.3959ZM80.9756 56.8365L47.3698 49.4683L40.0016 83.0742L73.6074 90.4424L80.9756 56.8365Z" fill="#004B85" fill-opacity="0.15"/>
<path d="M61.7 27.8L64.5 30.6L61.7 33.4L58.9 30.6L61.7 27.8ZM54 28.3V32.3H50V28.3H54ZM64 38.3V42.3H60V38.3H64ZM61.7 25L56 30.6L61.7 36.3H58V44.3H66V36.3H61.7L67.3 30.6L61.7 25ZM56 26.3H48V34.3H56V26.3ZM54 38.3V42.3H50V38.3H54ZM56 36.3H48V44.3H56V36.3Z" fill="#004B85"/>
</g>
</svg>
`
        );
        container.appendChild(widgetIcon);
        container.appendChild(document.createTextNode(widget.title));
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
      this.isDragging = true
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
        console.log('hhhhhhhhhh')
        if (clientX - x > event.source.offsetWidth / 4) {
          event.originalSource.classList.remove('floatLeft')

          event.originalSource.classList.add('floatRight')
          console.log('event.source', event.source)
        } else if (clientX - x < -event.source.offsetWidth / 4) {
          event.originalSource.classList.remove('floatRight')

          event.originalSource.classList.add('floatLeft')

          console.log('event.source', event.source)

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
        let widgetData: any = this.widgetList.find(
          (e) => String(e.id) === event.source.getAttribute("id")
        );
        if (!widgetData) {
          widgetData = this.dashboardWidgetList.find(
            (e) => String(e.widgetid) === event.source.getAttribute("id")
          );
        }
        event.source.setAttribute("gs-w", widgetData?.w?.toString() || '4');
        event.source.setAttribute("gs-h", widgetData?.h?.toString() || '4');
        event.source.setAttribute("data-bc-bp-widget-container", "");
        console.log(`display: flex !important; border-radius: 24px; outline: 2px solid #ccc; outline-offset: -9px; height:${(widgetData?.h || 4) * this._page.cell
          } px; position: relative; background-color: transparent; justify-content: center; align-items: center; flex-direction: column`
        )
        const parent = document.querySelector(
          "[data-bc-page-body]"
        ) as HTMLElement;
        event.source.setAttribute(
          "style",
          `display: flex !important; border-radius: 24px; outline: 2px solid #ccc; outline-offset: -9px; height:${(widgetData?.h || 4) * this._page.cell
          } px; position: relative; background-color: transparent; justify-content: center; align-items: center; flex-direction: column`
        );
        if (
          event.source.attributes.getNamedItem("data-bc-page-widget-dashboard")
        ) {
        } else {
          event.source.children[0].setAttribute(
            "style",
            `display: flex; justify-content: center; align-items: center; width: 100%; height: 100% `
          );
        }
      }
    });
    this.sortable.on("drag:stop", (event) => {
      this.isDragging = false

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
        let widgetData: any = this.widgetList.find(
          (e) => String(e.id) === event.source.getAttribute("id")
        );
        if (!widgetData) {
          widgetData = this.disabledDashboardWidgetList.find(
            (e) => String(e.widgetid) === event.source.getAttribute("id") && String(e.moduleid) === event.source.getAttribute("moduleid")
          );
        }
        console.log('widgetData', widgetData)
        this.disabledWidgetList = this.disabledWidgetList.filter(e => e.id != widgetData.id)
        console.log(' this.disabledDashboardWidgetList', this.disabledDashboardWidgetList)
        this.disabledDashboardWidgetList = this.disabledDashboardWidgetList.filter(e => e.widgetid != widgetData.id && e.moduleid != widgetData.moduleid)
        console.log(' this.disabledDashboardWidgetList', this.disabledDashboardWidgetList)

        event.originalSource.setAttribute("gs-w", widgetData?.w?.toString() || '4');
        event.originalSource.setAttribute("gs-h", widgetData?.h?.toString() || '4');
        event.originalSource.setAttribute(
          "data-bc-bp-direction",
          this.direction
        );
        event.originalSource.querySelector("[data-bc-btn-remove]")?.remove();
        event.originalSource.setAttribute("data-bc-bp-widget-container", "");
        const parent = document.querySelector(
          "[data-bc-page-body]"
        ) as HTMLElement;
        console.log(' event.source.attributes.getNamedItem("style")?.value', event.source.attributes.getNamedItem("style")?.value)
        event.originalSource.setAttribute(
          "style",
          event.source.attributes.getNamedItem("style")?.value || ""
        );
        // event.originalSource.style.height = `${
        widgetData?.h || 4 * this._page.cell
        //   } px`;

        if (event.source.attributes.getNamedItem("pallete-widget-element")) {
          event.originalSource.children[0].setAttribute(
            "style",
            event.source.children[0].attributes.getNamedItem("style")?.value
          );
        }
        if (!event.originalSource.querySelector("[data-bc-add-height]")) {
          const increaseHeight = document.createElement("div");
          const increaseHeightTop = document.createElement("div");
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
              const data = this.widgetList.find(
                (e) =>
                  String(e.id) == (event.target as HTMLElement).parentElement.id
              );
              this.disabledWidgetList.push(data)
              this.fillListUI()

            } else {

              const data = this.dashboardWidgetList.find(
                (e) =>
                  String(e.widgetid) == (event.target as HTMLElement).parentElement.id && String(e.moduleid) == (event.target as HTMLElement).parentElement.getAttribute('moduleid')
              );

              this.disabledDashboardWidgetList.push(data)
              console.log('this.disabledDashboardWidgetList', this.disabledDashboardWidgetList)
              this.fillDashbaordWidgetList()

            }

            (event.target as HTMLElement)
              .closest("[data-bc-bp-widget-container]")
              .remove();
            this.enableDragDrop();
          });
          event.originalSource.appendChild(removeBtn);

          event.originalSource.appendChild(increaseHeight);
          event.originalSource.appendChild(increaseHeightTop);
          const increaseWidth = document.createElement("div");
          const increaseWidthRight = document.createElement("div");
          event.originalSource.appendChild(increaseWidth);
          event.originalSource.appendChild(increaseWidthRight);
          increaseHeight.setAttribute("data-bc-add-height", "");
          increaseHeightTop.setAttribute("data-bc-add-height-top", "");
          increaseWidth.setAttribute("data-bc-add-width", "");
          increaseWidthRight.setAttribute("data-bc-add-width-Right", "");

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
          increaseWidthRight.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;

            this.disableDragDrop();
          });

          increaseWidthRight.addEventListener("mouseleave", () => {
            this.enableDragDrop();
          });

          increaseWidthRight.addEventListener("mousedown", (event) =>
            this.handleMouseDown(event)
          );
          increaseHeight.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;
            this.sortable.destroy();
          });

          increaseHeight.addEventListener("mouseleave", () => {

            this.enableDragDrop();
          });

          increaseHeight.addEventListener("mousedown", (event) => {

            this.handleMouseDown(event)
          }

          );
          increaseHeightTop.addEventListener("mouseenter", () => {
            event.originalSource.draggable = false;
            this.sortable.destroy();
          });

          increaseHeightTop.addEventListener("mouseleave", () => {

            this.enableDragDrop();
          });

          increaseHeightTop.addEventListener("mousedown", (event) => {

            this.handleMouseDown(event)
          }

          );
          document.addEventListener("mousemove", (ev) =>
            this.handleMouseMove(ev)
          );
          document.addEventListener("mouseup", (_) => this.handleMouseUp());
        }

        event.originalSource.setAttribute("draggable", "true");
        event.originalSource.classList.add('widgetDragClass')
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
      case "widthRight":
        newWidth = this.startWidth - (this.startX - ev.clientX);

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
        console.log('newHeight', newHeight, this.currentResizeHandle, newHeight - this.currentResizeHandle.offsetHeight >=
          this._page.cell, newHeight - this.currentResizeHandle.offsetHeight <=
        -this._page.cell)
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
        console.log('this.currentResizeHandle', this.currentResizeHandle.style, this.currentResizeHandle.style.height)

        break;
      case "heightTop":
        newHeight = this.startHeight + (this.startY - ev.clientY);

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
        console.log('this.currentResizeHandle', this.currentResizeHandle.style, this.currentResizeHandle.style.height)

        break;
    }
  }
  handleMouseUp() {
    this.isDragging = false;
  }
  handleMouseDown = (ev) => {
    if (ev.srcElement.attributes["data-bc-add-height"]) {
      this.type = "height";
    } else if (ev.srcElement.attributes["data-bc-add-height-top"]) {

      this.type = "heightTop";

    } else if (ev.srcElement.attributes["data-bc-add-width"]) {

      this.type = "width";

    } else {
      this.type = "widthRight";

    }
    this.isDragging = true;
    this.currentResizeHandle = ev.target.parentElement;
    this.startX = ev.clientX;
    this.offsetTop = ev.target.offsetLeft;

    this.startY = ev.clientY;
    this.startWidth = ev.target.parentElement.offsetWidth;
    this.startHeight = ev.target.parentElement.offsetHeight;
    console.log('mousedown')
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
    const allTags = document.querySelectorAll('[data-bc-bp-widget-container]')
    const sortedTags = Array.from(allTags).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    const container = sortedTags[0].parentElement
    container.innerHTML = ''
    sortedTags.forEach(e => {
      container.appendChild(e)
    })
    container.setAttribute('primaryContainer', '1')
    const groups = document.querySelectorAll('[data-bc-bp-group-container]')
    groups.forEach((parent) => {
      if (!!!parent.getAttribute('primaryContainer')) {
        // console.log('parent :>>', parent)
        // const children = Array.from(parent.children);

        // children.forEach(child => {
        //   container.appendChild(child)
        // });

        parent.remove();
      }

    })

    this.widgetsContainer = container

    widgets.forEach((e: HTMLElement) => {
      const increaseHeight = document.createElement("div");
      const increaseWidth = document.createElement("div");
      const increaseHeightTop = document.createElement("div");
      const increaseWidthRight = document.createElement("div");

      increaseHeight.setAttribute("data-bc-add-height", "");
      increaseWidth.setAttribute("data-bc-add-width", "");
      increaseHeightTop.setAttribute("data-bc-add-height-top", "");
      increaseWidthRight.setAttribute("data-bc-add-width-right", "");
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
      increaseWidthRight.addEventListener("mouseenter", () => {
        e.draggable = false;
        this.sortable.destroy();
      });
      increaseWidthRight.addEventListener("mouseleave", () => {
        this.enableDragDrop();
      });
      increaseWidthRight.addEventListener("mousedown", (event) =>
        this.handleMouseDown(event)
      );
      e.appendChild(increaseWidth);
      e.appendChild(increaseWidthRight);
      e.insertBefore(increaseHeightTop, e.firstChild)
      e.appendChild(increaseHeight);

      increaseHeightTop.addEventListener("mouseenter", () => {
        e.draggable = false;
        this.sortable.destroy();
      });

      increaseHeightTop.addEventListener("mouseleave", () => {
        this.enableDragDrop();
      });

      increaseHeightTop.addEventListener("mousedown", (event) =>
        this.handleMouseDown(event)
      );
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
      e.classList.add("widgetDragClass");
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
  setTagSelected(e) {
    if (e.target.id !== this.selectedTag) {
      this.selectedTag = e.target.id
      document.querySelector('[data-bc-widget-tag-selected]').removeAttribute('data-bc-widget-tag-selected')
      document.querySelector(`[data-bc-widget-tag][id='${this.selectedTag}']`).setAttribute('data-bc-widget-tag-selected', '')
    }
    this.fillDashboardWidgets()
  }
  fillDashbaordWidgetList() {
    const parent = this.container.querySelector(
      "[data-bc-page-widget-dashboard-wrapper]"
    ) as HTMLElement;

    const tagsContainer = document.createElement('div')
    tagsContainer.setAttribute('data-bc-tags-container', '')
    const tag = document.createElement('div')
    tag.innerText = 'همه'

    tag.setAttribute('data-bc-widget-tag', '')
    tag.setAttribute('data-bc-widget-tag-selected', '')
    tag.id = String(0)
    tagsContainer.appendChild(tag)
    tag.addEventListener('click', (e) => this.setTagSelected(e))
    this.tags?.map(e => {
      const tag = document.createElement('div')
      tag.innerText = e.title
      tag.setAttribute('data-bc-widget-tag', '')
      tag.id = String(e.moduleid)
      tagsContainer.appendChild(tag)
      tag.addEventListener('click', (e) => this.setTagSelected(e))
    })


    parent.innerHTML = "";
    parent.appendChild(tagsContainer)
    this.fillDashboardWidgets()

  }
  fillDashboardWidgets() {
    const parent = this.container.querySelector(
      "[data-bc-page-widget-dashboard-wrapper]"
    ) as HTMLElement;
    parent.querySelectorAll('[data-bc-page-widget-dashboard]').forEach(e => {
      e.remove()
    })
    const removewidgetUrl = HttpUtil.formatString(
      this.options.removeFromDashbaord,
      {
        rKey: this.options.rKey,
      }
    );
    const widgets = this.selectedTag != '0' ? this.tags.find(i => i.moduleid == (Number(this.selectedTag))).widgets.filter(j => this.disabledDashboardWidgetList.find(k => k.moduleid == Number(this.selectedTag) && k.widgetid == j.widgetid)).map(i => ({ widgetid: i.widgetid, title: i.title, icon: i.icon, moduleid: this.tags.find(i => i.moduleid == (Number(this.selectedTag))).moduleid })) : this.disabledDashboardWidgetList

    widgets?.filter(e => e.title.includes(this.searchParam)).forEach((widgetList) => {
      const widgetDiv = document.createElement("div");
      const insideContainer = document.createElement("div");
      insideContainer.setAttribute("data-bc-dashboard-widget-container", "");
      const closeDiv = document.createElement("span");
      widgetDiv.setAttribute("data-bc-page-widget-dashboard", "");
      widgetDiv.setAttribute("moduleid", this.selectedTag != '0' ? this.selectedTag : String(widgetList.moduleid));
      widgetDiv.id = String(widgetList.widgetid);
      widgetDiv.setAttribute("data-sys-text", "");
      closeDiv.setAttribute("data-bc-btn-remove", "");
      closeDiv.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns = "http://www.w3.org/2000/svg" >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="white" />
        </svg>`;
      const widgetIcon = document.createElement("img");
      widgetIcon.setAttribute("src", widgetList?.icon ? widgetList.icon : `data:image/svg+xml,%3Csvg%20width%3D%22116%22%20height%3D%2270%22%20viewBox%3D%220%200%20116%2070%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3Cmask%20id%3D%22mask0_12273_103335%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22116%22%20height%3D%2270%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3C%2Fmask%3E%0A%3Cg%20mask%3D%22url%28%23mask0_12273_103335%29%22%3E%0A%3Cpath%20d%3D%22M112.749%2026.3801L121.932%2040.721L107.591%2049.9042L98.4076%2035.5633L112.749%2026.3801ZM79.9424%2021.3886L76.2583%2038.1915L59.4553%2034.5074L63.1394%2017.7045L79.9424%2021.3886ZM112.739%2072.6062L109.055%2089.4091L92.2524%2085.725L95.9365%2068.9221L112.739%2072.6062ZM115.327%2014.618L86.2255%2032.8923L104.92%2062.0863L89.3771%2058.6786L82.0089%2092.2844L115.615%2099.6526L122.983%2066.0468L104.92%2062.0863L133.694%2043.2999L115.327%2014.618ZM90.1859%2014.8292L56.58%207.46096L49.2118%2041.0668L82.8177%2048.435L90.1859%2014.8292ZM70.7321%2063.3959L67.048%2080.1989L50.2451%2076.5148L53.9292%2059.7118L70.7321%2063.3959ZM80.9756%2056.8365L47.3698%2049.4683L40.0016%2083.0742L73.6074%2090.4424L80.9756%2056.8365Z%22%20fill%3D%22%23004B85%22%20fill-opacity%3D%220.15%22%2F%3E%0A%3Cpath%20d%3D%22M61.7%2027.8L64.5%2030.6L61.7%2033.4L58.9%2030.6L61.7%2027.8ZM54%2028.3V32.3H50V28.3H54ZM64%2038.3V42.3H60V38.3H64ZM61.7%2025L56%2030.6L61.7%2036.3H58V44.3H66V36.3H61.7L67.3%2030.6L61.7%2025ZM56%2026.3H48V34.3H56V26.3ZM54%2038.3V42.3H50V38.3H54ZM56%2036.3H48V44.3H56V36.3Z%22%20fill%3D%22%23004B85%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A

`);
      insideContainer.appendChild(widgetIcon);
      insideContainer.appendChild(document.createTextNode(widgetList.title));

      insideContainer.appendChild(closeDiv);
      widgetDiv.appendChild(insideContainer);
      parent.appendChild(widgetDiv);
      widgetDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(widgetList));
      });
      closeDiv.addEventListener("mouseenter", (event) => {
        // (event.target as HTMLElement).closest('[draggable="true"]').setAttribute('draggable', 'false')
        this.disableDragDrop();
      });
      closeDiv.addEventListener("mouseleave", () => {
        this.enableDragDrop();
      });
      closeDiv.addEventListener("mousedown", async () => {
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
        this.enableDragDrop();
      });

    });
  }
  public async addingDashboardWidgets(): Promise<void> {
    const parent = this.container.querySelector(
      "[data-bc-page-widget-dashboard-wrapper]"
    ) as HTMLElement;
    const dashbaordBtn = this.container.querySelector(
      ".tabWrapperForWidgets"
    ) as HTMLElement;
    dashbaordBtn.style.display = "flex";

    const url = HttpUtil.formatString(
      this.options.baseUrl[this._page.loaderParam.owner] + this.options.method.dashboardReservedWidgets,
      {
        rKey: this.options.rKey,
        pid: this._page.loaderParam.pageId
      }
    );

    const data = await HttpUtil.fetchStringAsync(url, "GET");
    console.log('data : >>', data)
    if (JSON.parse(data).length) {

      JSON.parse(data).forEach(e => this.disabledDashboardWidgetList.push(...e.widgets.map(i => ({ ...i, moduleid: e.moduleid }))))
      this.dashboardWidgetList = this.disabledDashboardWidgetList
      this.tags = JSON.parse(data)
      console.log('this.tags', this.tags)
      // this.categories = data
    }

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
    dashboardWidgetBtn.addEventListener("click", (e) => {
      this.tabIndex = 1
      parent.style.display = "flex";
      allWidget.style.display = "none";
      activeElement.style.transform = `translateX(-${(allWidgetBtn as HTMLElement).offsetLeft - (e.target as HTMLElement).offsetLeft}px)`;
      dashboardWidgetBtn.setAttribute("tab-button-status", "active");
      allWidgetBtn.removeAttribute("tab-button-status");
      this.fillDashbaordWidgetList()

    });
    allWidgetBtn.addEventListener("click", (e) => {
      this.tabIndex = 0

      parent.style.display = "none";
      allWidget.style.display = "flex";
      activeElement.style.transform = `translateX(0px)`;
      allWidgetBtn.setAttribute("tab-button-status", "active");
      dashboardWidgetBtn.removeAttribute("tab-button-status");
      this.fillListUI()
    });
  }
}
