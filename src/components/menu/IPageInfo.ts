import { ILoaderParam } from "../../type-alias";

export interface IPageLoaderParam extends ILoaderParam {
  pageId: number;
  pageMethod: string;
}
