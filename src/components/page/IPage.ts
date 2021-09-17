import IWidgetInfo from "../widget/IWidgetInfo";
import IPageInfo from "./IPageInfo";

export default interface IPage {
  tryAddingWidget(widgetInfo: IWidgetInfo);

  container: Element;
  info: IPageInfo;
}
