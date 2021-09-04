import { MergeType } from "./enum";
import ISourceOptions from "./ISourceOptions";
import { SourceId } from "./type-alias";

export default interface ISource {
  mergeType: MergeType;
  id: SourceId;
  rows: Array<any>;
  keyFieldName?: string;
  statusFieldName?: string;
  versions: Array<number>;

  cloneOptions(): ISourceOptions;
  removeRowFormIndex(index: number): void;
  replaceRowFromIndex(index: number, newRow: any): void;
  addRow(row: any): void;
  addRows(rows: any[]): void;
  getVersion(row: any): number;
  replace(source: ISource): void;
}
