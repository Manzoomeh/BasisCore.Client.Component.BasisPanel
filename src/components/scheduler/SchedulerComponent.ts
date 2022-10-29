import {
  EventHandler,
  IDependencyContainer,
  ISource,
  IUserDefineComponent,
} from "basiscore";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import IScheduler from "./IScheduler";
import ITaskOptions, { IReportParam } from "./ITaskOptions";
import PostTaskOptions from "./PostTaskOptions";
import TaskProcess from "./TaskProcess";

export default class SchedulerComponent
  extends BasisPanelChildComponent
  implements IScheduler
{
  private processList: Map<string, TaskProcess>;
  public readonly ulElement: HTMLUListElement;
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-scheduler-container");
    this.processList = new Map<string, TaskProcess>();
    this.ulElement = this.container.querySelector("[data-bc-main-task-list]");
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("scheduler", this);
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.TASK_START]);
    return Promise.resolve();
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

  public startTask(taskOptions: ITaskOptions): void {
    if (taskOptions.task) {
      taskOptions.key = this.owner.getRandomName("task");
      const process = new TaskProcess(this, taskOptions, taskOptions.key);
      this.processList.set(taskOptions.key, process);
    }
  }

  public startPost(
    data: FormData,
    url: string,
    title: string,
    callback?: EventHandler<IReportParam>,
    cancelable?: boolean
  ): ITaskOptions {
    const taskOptions = new PostTaskOptions(
      data,
      url,
      title,
      callback,
      cancelable
    );
    this.startTask(taskOptions);
    return taskOptions;
  }
}
