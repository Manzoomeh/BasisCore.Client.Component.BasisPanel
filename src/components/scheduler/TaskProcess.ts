import ITaskOptions, { IReportParam } from "./ITaskOptions";
import SchedulerComponent from "./SchedulerComponent";
import layout from "./assets/item-layout.html";
import { EventHandler } from "basiscore";

export default class TaskProcess {
  private _owner: SchedulerComponent;
  private _options: ITaskOptions;
  private _key: string;
  private _container: Element;

  constructor(owner: SchedulerComponent, options: ITaskOptions, key: string) {
    this._owner = owner;
    this._options = options;
    this._key = key;
    this._container = document.createElement("div");
    const range = new Range();
    range.setStart(this._container, 0);
    range.setEnd(this._container, 0);
    range.insertNode(range.createContextualFragment(layout));
    range.detach();
    owner.ulElement.appendChild(this._container);
    this.startDisplayAjax();
    this._options.task.finally(this.dispose.bind(this));
    const btn = this._container.querySelector("[data-bc-task-list-btn-cancel]");
    if (this._options.cancel) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this._options?.cancel();
      });
    } else {
      btn.remove();
    }

    this._container.querySelector("[data-bc-task-list-title]").innerHTML =
      this._options.title;
    const uiHandler: EventHandler<IReportParam> = (param: IReportParam) => {
      var title = param.title;
      if (param.error) {
        title += ` (${param.error})`;
      } else if (param.cancel) {
        title += " (cancel)";
      }
      this._container.querySelector("[data-bc-task-list-title]").innerHTML =
        title;

      this._container.querySelector(
        "[data-bc-task-list-percent]"
      ).innerHTML = `${param.percent}%`;
      (
        this._container.querySelector("[data-bc-task-list-progress-bar]") as any
      ).style.width = `${param.percent}%`;
    };
    this._options.reportHandlers.Add(uiHandler);
  }

  public dispose(): void {
    this.endDisplayAjax();
    this._owner.taskComplete(this._key, this._options);
    setTimeout((_) => this._container.remove(), 3_000);
  }

  private startDisplayAjax() {
    if (this._options.container) {
      //console.log("start display ajax", this._options);
    }
  }

  private endDisplayAjax() {
    if (this._options.container) {
      //console.log("end display ajax", this._options);
    }
  }
}
