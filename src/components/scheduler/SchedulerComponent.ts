import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";
import ITaskOptions from "./ITaskOptions";
import TaskProcess from "./TaskProcess";
declare const $bc: any;

export default class SchedulerComponent extends BasisPanelChildComponent {
  private processList: Map<string, TaskProcess>;
  private readonly ulElement: HTMLUListElement;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-scheduler-container");
    this.processList = new Map<string, TaskProcess>();
    this.ulElement = this.container.querySelector("[data-bc-main-task-list");
    $bc.basisPanel.scheduler = {
      startTask: this.startTask.bind(this),
    };
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.TASK_START]);
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.TASK_INIT) {
      const taskOptions = source.rows[0] as ITaskOptions;
      this.startTask(taskOptions);
    }
  }

  public taskComplete(key: string, options: ITaskOptions) {
    // console.log(`${key} task is ended`);
    this.processList.delete(key);
  }

  public startTask(taskOptions: ITaskOptions): string {
    let key: string = null;
    if (taskOptions.task) {
      key = this.owner.getRandomName("task");
      const process = new TaskProcess(this, taskOptions, key);
      this.processList.set(key, process);
    }
    return key;
  }
}
