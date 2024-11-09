import layout from "./assets/layout.html";
import "./assets/style.css";
import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent, ISource, BCWrapperFactory } from "basiscore";
import PageWidgetComponent from "../PageWidgetComponent";

export default class FullPageWidgetComponent extends PageWidgetComponent {
  // set title(value: string) {
  //   this.container.querySelector(
  //     "[data-bc-fullpage-header] > [data-bc-fullpage-title]"
  //   ).textContent = value;
  // }
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, layout, "data-bc-bp-fullpage-container");
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
      this.param.y * cell + parent.offsetTop
    }px`;
    // (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    // this.title = this.param.title;

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

    const url = HttpUtil.formatString(
      `${this.param.url ?? this.param.page.moduleUrl}${
        this.options.method.widget
      }`,
      { rKey: this.options.rKey, widgetId: this.param.id }
    );

    const container = this.container.querySelector(
      "[data-bc-fullpage-body-container]"
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
        //   .querySelectorAll("[data-bc-fullpage-btn-close]")
        //   .forEach((btn) =>
        //     btn.addEventListener("click", (e) => {
        //       e.preventDefault();
        //       this.removeAsync();
        //     })
        //   );
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
    //$bc?.basisPanel?.scheduler?.startTask(taskOptions);
  }

  public runAsync(source?: ISource) {
    return true;
  }

  // private async removeAsync(): Promise<void> {
  //   await this.owner.disposeAsync();
  //   this.container.remove();
  //   this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
  // }
}
