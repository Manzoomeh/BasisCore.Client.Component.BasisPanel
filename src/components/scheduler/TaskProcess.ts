import ITaskOptions from "./ITaskOptions";
import SchedulerComponent from "./SchedulerComponent";

export default class TaskProcess {
  private _owner: SchedulerComponent;
  private _options: ITaskOptions;
  private _key: string;

  constructor(owner: SchedulerComponent, options: ITaskOptions, key: string) {
    this._owner = owner;
    this._options = options;
    this._key = key;
    this.startDisplayAjax();
    this._options.task.finally(this.dispose.bind(this));
  }

  public dispose(): void {
    this.endDisplayAjax();
    this._owner.taskComplete(this._key, this._options);
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
