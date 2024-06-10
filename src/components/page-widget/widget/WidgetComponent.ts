import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent } from "basiscore";
import { ISource } from "basiscore";
import { DefaultSource } from "../../../type-alias";
import PageWidgetComponent from "../PageWidgetComponent";
import { sidebar } from "../../../ComponentLoader";

export default class WidgetComponent extends PageWidgetComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-widget-container");
  }

  public async initializeAsync(): Promise<void> {
    let topPosition = 0;
    const hasSidebar = this.owner.node.getAttribute("has-sidebar");
    if (hasSidebar == "true" && this.options.culture.deviceId == 2) {
      topPosition = 50;
    }

    this.container.setAttribute("data-bc-bp-widget-container-drag", "");
    this.container.setAttribute("id", String(this.param.id));
    const closeBtn = this.container.querySelector(
      "[data-bc-widget-btn-close]"
    ) as HTMLElement;
    closeBtn.setAttribute("style", "display:none !important;z-index:10");

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const disableWidgets = document.querySelector(
        "[data-bc-page-widget-disableList]"
      );
      try {
        this.removeAsync();
        const widgetElement = document.createElement("div");
        const container = document.createElement("div");

        const widgetIcon = document.createElement("img");
        widgetElement.setAttribute("draggable", "true");
        widgetElement.setAttribute("id", String(this.param.id));
        widgetElement.setAttribute("pallete-widget-element", "");
        widgetIcon.setAttribute(
          "src",
          this.param.icon ? this.param.icon : "asset/images/no_icon.png"
        );
        container.appendChild(document.createTextNode(this.param.title));
        container.appendChild(widgetIcon);
        widgetElement.appendChild(container);

        widgetElement.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify(this.param));
        });

        disableWidgets.appendChild(widgetElement);
      } catch (e) {
        console.log("error :>> ", e);
      }
    });
    this.container.setAttribute("gs-x", this.param.x.toString());
    this.container.setAttribute("gs-y", this.param.y.toString());
    this.container.setAttribute("gs-w", this.param.w.toString());
    this.container.setAttribute("gs-h", this.param.h.toString());
    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    const cell = parent.offsetWidth / 12;
    (this.container as HTMLElement).style.height = `${this.param.h * cell}px`;
    (this.container as HTMLElement).style.top = `${
      this.param.y * cell + (parent.clientTop + topPosition)
    }px`;

    // (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    // if (this.deviceId == 2) {
    //   const uniqueName = `widget${this.param.id.toString()}`;
    //   this.container.setAttribute("id", uniqueName);
    //   const li = document.createElement("li");
    //   li.setAttribute("data-bc-page-widgets-list-move-ico", "");
    //   li.setAttribute("data-widget", uniqueName);
    //   li.addEventListener("click", function (e) {
    //     document.getElementById(uniqueName).scrollIntoView(true);
    //   });
    //   const span = document.createElement("span");
    //   span.textContent = `${this.param.id.toString()}`;
    //   li.appendChild(span);
    //   this.container.closest("[data-bc-bp-page-container]").querySelector("[data-bc-page-widgets-list-toggle]").appendChild(li);
    // }

    this.title = this.param.title;

    const url = HttpUtil.formatString(
      `${this.param.url ?? this.param.page.ownerUrl}${
        this.options.method.reservedWidget
      }`,
      { rKey: this.options.rKey, widgetId: this.param.id }
    );

    const container = this.container.querySelector(
      "[data-bc-widget-body-container]"
    );
    const processTask = new Promise<void>(async (resolve, reject) => {
      try {
        var content = await HttpUtil.fetchStringAsync(url, "GET");
        const range = new Range();
        range.setStart(container, 0);
        range.setEnd(container, 0);
        const newContent = range.createContextualFragment(content);
        const nodes = Array.from(newContent.childNodes);
        range.insertNode(newContent);
        this.owner.processNodesAsync(nodes);
        // this.container
        //   .querySelectorAll("[data-bc-widget-btn-close]")
        //   .forEach((btn) =>
        //     btn.addEventListener("click", (e) => {
        //       e.preventDefault();
        //       this.removeAsync();
        //     })
        //   );

        if (
          this.param.addToDashboard == null ||
          this.param.addToDashboard == true
        ) {
          this.container
            .querySelectorAll("[data-bc-widget-btn-add-dashboard]")
            .forEach((btn) => {
              const currentAddToDashboardBtn = btn as HTMLElement;
              currentAddToDashboardBtn.style.display = "inline-block";
              btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.addToDashboard();
              });
            });
        }

        resolve();
      } catch (e) {
        reject(e);
      }
    });
    // const taskOptions: ITaskOptions = {
    //   container: container,
    //   task: processTask,
    //   notify: false,
    // };
    // this.owner.dc.resolve<IScheduler>("scheduler").startTask(taskOptions);
  }

  public runAsync(source?: ISource) {
    return true;
  }

  private async removeAsync(): Promise<void> {
    try {
      await this.owner.disposeAsync();
    } catch (e) {
      console.log("error :>> ", e);
    }
    this.container.remove();
    // this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
  }

  private async addToDashboard(): Promise<void> {
    const widgetTitle = this.owner.dc.resolve<any>("widget");
    const widgetId = this.param.id;
    const apiInputs = { widgetid: widgetId, title: widgetTitle.title };
    const url = HttpUtil.formatString(this.options.addtoDashboard, {
      rKey: this.options.rKey,
    });
    await HttpUtil.fetchStringAsync(url, "POST", apiInputs);
  }
}
