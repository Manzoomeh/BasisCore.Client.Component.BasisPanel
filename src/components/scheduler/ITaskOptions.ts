import { EventManager } from "basiscore";

export default interface ITaskOptions {
  key?: string;
  container?: Element;
  title?: string;
  type?: TaskType;
  reportHandlers?: EventManager<IReportParam>;
  task: Promise<any>;
  notify?: boolean;
  cancel?: () => void;
}

export enum TaskType {
  continuous = 0,
  progressive = 1,
}

export interface IReportParam {
  percent: number;
  title: string;
  cancel?: boolean;
  error?: string;
}
