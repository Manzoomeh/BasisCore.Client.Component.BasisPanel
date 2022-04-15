import IWidgetInfo from "../page-widget/widget/IWidgetInfo";

export interface IPageGroupInfo {
  groupName: string;
  options: object;
  widgets: Array<IWidgetInfo>;
}
