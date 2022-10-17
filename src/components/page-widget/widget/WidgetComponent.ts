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

export default class WidgetComponent extends PageWidgetComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-widget-container");
  }

  public async initializeAsync(): Promise<void> {
    this.container.setAttribute("gs-x", this.param.x.toString());
    this.container.setAttribute("gs-y", this.param.y.toString());
    this.container.setAttribute("gs-w", this.param.w.toString());
    this.container.setAttribute("gs-h", this.param.h.toString());
    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    const cell = parent.offsetWidth / 12;

    (this.container as HTMLElement).style.height = `${this.param.h * cell}px`;
    (this.container as HTMLElement).style.top = `${
      this.param.y * cell + parent.clientTop
    }px`;
    // (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    this.container.setAttribute("id", `widget${this.param.id.toString()}`);

    this.title = this.param.title;

    const url = HttpUtil.formatString(
      `${this.param.url ?? this.param.page.ownerUrl}${
        this.options.method.widget
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
        this.container
          .querySelectorAll("[data-bc-widget-btn-close]")
          .forEach((btn) =>
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              this.removeAsync();
            })
          );

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
    await this.owner.disposeAsync();
    this.container.remove();
    this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
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
