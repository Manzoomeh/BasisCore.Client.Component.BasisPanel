import IPageLoaderParam from "../menu/IPageLoaderParam";
import IWidgetInfo from "./IWidgetInfo";

export default interface IWidgetParam extends IWidgetInfo {
  page: IPageLoaderParam;
}
