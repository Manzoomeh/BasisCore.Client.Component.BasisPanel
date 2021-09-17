import IPageInfo from "../page/IPageInfo";
import { IPageLoaderParam } from "./IPageInfo";

export default interface IPageParam extends IPageLoaderParam {
  pageInfo: IPageInfo;
}
