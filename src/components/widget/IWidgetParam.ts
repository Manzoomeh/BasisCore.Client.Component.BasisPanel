import IPageParam from "../menu/IPageParam";
import IWidgetInfo from "./IWidgetInfo";

export default interface IWidgetParam extends IWidgetInfo {
  pageParam: IPageParam;
  widgetMethod: string;
}
