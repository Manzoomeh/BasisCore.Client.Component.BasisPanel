import IWidgetInfo from "../widget/IWidgetInfo";

export default interface IPage {
  tryAddingWidget(widgetInfo: IWidgetInfo);

  content: Element;
}
