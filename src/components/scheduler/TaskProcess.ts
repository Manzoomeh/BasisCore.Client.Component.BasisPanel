import ITaskOptions from "./ITaskOptions";
import SchedulerComponent from "./SchedulerComponent";

export default class TaskProcess {
    private _owner: SchedulerComponent;
    private _options: ITaskOptions;
    public get id(): number {
        return this._options.id;
    }

    constructor(owner: SchedulerComponent, options: ITaskOptions) {
        this._owner = owner;
        this._options = options;
        this._options.task.then(x => this.dispose.bind(this));
    }

    public dispose(): void {
        this._owner.processEnded(this);
    }
}
