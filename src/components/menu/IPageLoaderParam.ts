import { ILoaderParam } from "../../type-alias";

export default interface IPageLoaderParam extends ILoaderParam {
  pageId: string;
  pageMethod: string;
  arguments?: any;
  dashboard?: boolean;
  module: string;
}
