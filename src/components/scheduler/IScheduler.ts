import ITaskOptions from "./ITaskOptions";

export default interface IScheduler {
  startTask(taskOptions: ITaskOptions): string;
  startPost(data: FormData, url: string, title: string): string;
}
