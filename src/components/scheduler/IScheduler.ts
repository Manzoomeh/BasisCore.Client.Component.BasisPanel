import { EventHandler } from "basiscore";
import ITaskOptions, { IReportParam } from "./ITaskOptions";

export default interface IScheduler {
  startPost(
    data: FormData,
    url: string,
    title: string,
    callback?: EventHandler<IReportParam>,
    cancelable?: boolean
  ): ITaskOptions;
}
