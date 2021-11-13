import IPageLoaderParam from "../menu/IPageLoaderParam";
import ISidebarInfo from "./ISidebarInfo";

export default interface IWidgetParam extends ISidebarInfo {
  page: IPageLoaderParam;
}
