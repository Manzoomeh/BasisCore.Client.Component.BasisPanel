import IPageLoaderParam from "../menu/IPageLoaderParam";
import IWidgetInfo from "../widget/IWidgetInfo";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";

export default interface IPage {
  tryAddingWidget(widgetInfo: IWidgetInfo);

  container: Element;
  info: IPageInfo;
  loaderParam: IPageLoaderParam;
  arguments: any;
  type: PageType;
}
