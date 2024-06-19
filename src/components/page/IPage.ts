import IPageLoaderParam from "../menu/IPageLoaderParam";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";

export default interface IPage {
  cell: number;
  addingPageGroupsAsync(info: IPageInfo): unknown;

  widgetDropAreaContainer: HTMLElement;
  container: Element;
  info: IPageInfo;
  loaderParam: IPageLoaderParam;
  arguments: any;
  type: PageType;
}
