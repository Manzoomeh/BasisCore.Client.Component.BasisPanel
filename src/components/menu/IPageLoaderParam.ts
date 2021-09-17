import { ILoaderParam } from "../../type-alias";

export default interface IPageLoaderParam extends ILoaderParam {
  pageId: string;
  pageMethod: string;
}
