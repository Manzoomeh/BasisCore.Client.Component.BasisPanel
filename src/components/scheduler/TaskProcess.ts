import ITaskOptions from "./ITaskOptions";
import SchedulerComponent from "./SchedulerComponent";

export default  class TaskProcess {
    private _owner: SchedulerComponent;
    private _options: ITaskOptions;
    constructor(owner: SchedulerComponent, options: ITaskOptions) {
        this._owner = owner;
        this._options = options;
    }
}
