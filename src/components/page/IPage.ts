import IPageLoaderParam from "../menu/IPageLoaderParam";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";

export default interface IPage {
  addingPageGroupsAsync(info: IPageInfo): unknown;
  initializeAsync(): void;
  widgetDropAreaContainer: HTMLElement;
  cell: number;
  container: Element;
  info: IPageInfo;
  loaderParam: IPageLoaderParam;
  arguments: any;
  type: PageType;
}
