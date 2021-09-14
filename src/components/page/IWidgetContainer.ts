import IWidgetInfo from "../widget/IWidgetInfo";

export default interface IWidgetContainer {
  addWidgetContent(content: Element);
  closeWidget(widgetInfo: IWidgetInfo);
}
