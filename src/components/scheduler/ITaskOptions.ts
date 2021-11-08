export default interface ITaskOptions {
  container?: Element;
  title?: string;
  cancelable?: boolean;
  type?: TaskType;
  reportCallback?: IReportCallback;
  task: Promise<any>;
  notify?: boolean;
}

export enum TaskType {
  continuous = 0,
  progressive = 1,
}

export type IReportCallback = (percent: number, title: string) => void;
