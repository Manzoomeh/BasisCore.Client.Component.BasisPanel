import IWidgetInfo from "../page-widget/widget/IWidgetInfo";

export default interface IWidgetContainer {
  addWidgetContent(content: Element);
  closeWidget(widgetInfo: IWidgetInfo);
}
