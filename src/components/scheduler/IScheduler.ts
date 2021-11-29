import ITaskOptions from "./ITaskOptions";

export default interface IScheduler {
  startTask(taskOptions: ITaskOptions): string;
}
