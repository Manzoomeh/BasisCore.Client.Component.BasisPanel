import IPageLoaderParam from "../menu/IPageLoaderParam";
import IFullPageWidgetInfo from "./IFullPageWidgetInfo";

export default interface IWidgetParam extends IFullPageWidgetInfo {
  page: IPageLoaderParam;
}
