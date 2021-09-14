import IWidgetInfo from "../widget/IWidgetInfo";

export default interface IPageInfo {
  widgets: Array<IWidgetInfo>;
  content?: string;
}
