import { ILoaderParam } from "../../type-alias";

export interface IPageLoaderParam extends ILoaderParam {
  pageId: string;
  pageMethod: string;
}
