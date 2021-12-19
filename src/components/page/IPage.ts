import IPageLoaderParam from "../menu/IPageLoaderParam";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPageInfo from "./IPageInfo";

export default interface IPage {
  addingGroups(pageInfo: any);
  tryAddingWidget(widgetInfo: IWidgetInfo);

  container: Element;
  info: IPageInfo;
  loaderParam: IPageLoaderParam;
  arguments: any;
}
