import { MergeType } from "./enum";

export default interface ISourceOptions {
  mergeType?: MergeType;
  keyFieldName?: string;
  statusFieldName?: string;
}
