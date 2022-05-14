import IPageLoaderParam from "../menu/IPageLoaderParam";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";

export default interface IPage {
  widgetDropAreaContainer: HTMLElement;
  container: Element;
  info: IPageInfo;
  loaderParam: IPageLoaderParam;
  arguments: any;
  type: PageType;
}
