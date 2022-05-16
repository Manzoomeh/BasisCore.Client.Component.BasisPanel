import ITaskOptions, { IReportCallback } from "./ITaskOptions";

export default interface IScheduler {
  startTask(taskOptions: ITaskOptions): void;
  startPost(
    data: FormData,
    url: string,
    title: string,
    callback?: IReportCallback,
    cancelable?: boolean
  ): ITaskOptions;
}
