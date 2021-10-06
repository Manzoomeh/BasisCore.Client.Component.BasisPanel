import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import ITaskOptions from "./ITaskOptions";
import TaskProcess from "./TaskProcess";

export default class SchedulerComponent extends BasisPanelChildComponent {
    private processList: Map<number, TaskProcess>;
    private readonly ulElement: HTMLUListElement;
    constructor(owner: IUserDefineComponent) {
        super(owner, layout, "data-bc-bp-scheduler-container");
        this.processList = new Map<number, TaskProcess>();
        this.ulElement = this.container.querySelector('[data-bc-main-task-list')
    }

    public initializeAsync(): void | Promise<void> {
        this.owner.addTrigger([DefaultSource.TASK_START])
    }

    public runAsync(source?: ISource) {
        if (source?.id === DefaultSource.TASK_INIT) {
            const taskOptions = source.rows[0] as ITaskOptions;
            if (this.processList.has(taskOptions.id)) {
                //TODO: rase error
                console.error(`key ${taskOptions.id} is already exist!`, taskOptions);
            } else {
                const process = new TaskProcess(this, taskOptions);
                this.processList.set(taskOptions.id, process);
            }
        }
    }

    public processEnded(process: TaskProcess) {
        this.processList.delete(process.id);
    }

}

