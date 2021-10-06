import IWidgetInfo from "../widget/IWidgetInfo";

export interface IPageGroupInfo {
  groupName: string;
  options: object;
  widgets: Array<IWidgetInfo>;
}
