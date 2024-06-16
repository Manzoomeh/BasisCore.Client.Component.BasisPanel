import ITaskOptions, { IReportParam } from "./ITaskOptions";
import SchedulerComponent from "./SchedulerComponent";
import layout from "./assets/item-layout.html";
import { BCWrapperFactory, EventHandler, EventManager } from "basiscore";

declare const $bc: BCWrapperFactory;
export default class TaskProcess {
  private _owner: SchedulerComponent;
  private _options: ITaskOptions;
  private _key: string;
  private _container: Element;
  private _ajaxNode: Element;

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
    owner.ulElement.querySelector<HTMLElement>(
      "[data-bc-task-list-noTask]"
    ).style.display = "none";
    owner.ulElement.appendChild(this._container);
    const alarmEl = this._owner.container.querySelector(
      "[data-bc-task-list-alarm]"
    );
    this._owner.container.setAttribute(
      "data-count",
      (parseInt(alarmEl.textContent) + 1).toString()
    );
    if (this._owner.container.querySelector("[data-bc-task-list-count-text]")) {
      this._owner.container.querySelector(
        "[data-bc-task-list-count-text] span"
      ).innerHTML = (parseInt(alarmEl.textContent) + 1).toString();
    }
    alarmEl.innerHTML = (parseInt(alarmEl.textContent) + 1).toString();
    const mainAlarmEl = this._owner.container.closest(
      "[data-bc-bp-main-header]"
    );
    const mainAlarm = mainAlarmEl.getAttribute("data-alertCount");
    mainAlarmEl.setAttribute(
      "data-alertCount",
      (parseInt(mainAlarm) + 1).toString()
    );
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
      let title = param.title;
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

      this._container.querySelector<HTMLElement>(
        "[data-bc-task-list-progress-bar]"
      ).style.width = `${param.percent}%`;
    };
    if (!this._options.reportHandlers) {
      this._options.reportHandlers = new EventManager<IReportParam>();
    }
    this._options.reportHandlers.Add(uiHandler);
  }

  public dispose(): void {
    this.endDisplayAjax();
    this._owner.taskComplete(this._key, this._options);
    setTimeout((_) => {
      this._container.remove();
      const alarmEl = this._owner.container.querySelector(
        "[data-bc-task-list-alarm]"
      );
      this._owner.container.setAttribute(
        "data-count",
        (parseInt(alarmEl.textContent) - 1).toString()
      );
      if (
        this._owner.container.querySelector("[data-bc-task-list-count-text]")
      ) {
        this._owner.container.querySelector(
          "[data-bc-task-list-count-text] span"
        ).innerHTML = (parseInt(alarmEl.textContent) - 1).toString();
      }
      alarmEl.innerHTML = (parseInt(alarmEl.textContent) - 1).toString();
      const mainAlarmEl = this._owner.container.closest(
        "[data-bc-bp-main-header]"
      );
      const mainAlarm = mainAlarmEl.getAttribute("data-alertCount");
      mainAlarmEl.setAttribute(
        "data-alertCount",
        (parseInt(mainAlarm) - 1).toString()
      );
      const countTask = this._owner.container.querySelectorAll(
        "[data-bc-task-list-item]"
      ).length;
      if (countTask == 0) {
        this._owner.container.querySelector<HTMLElement>(
          "[data-bc-task-list-noTask]"
        ).style.display = "block";
      }
    }, 3_000);
  }

  private startDisplayAjax() {
    this._ajaxNode?.remove();
    if (this._options.container) {
      this._options.container.setAttribute("data-bc-loading-container", "");
      this._ajaxNode = $bc.util.toHTMLElement(
        `<div class="loading"><h2 class="animate">Loading</h2></div>`
      );

      this._options.container.append(this._ajaxNode);
      console.log("start display ajax", this._options);
    }
  }

  private endDisplayAjax() {
    if (this._options.container) {
      console.log("end display ajax", this._options);
      this._options.container.removeAttribute("data-bc-loading-container");
      this._ajaxNode.remove();
    }
  }
}
