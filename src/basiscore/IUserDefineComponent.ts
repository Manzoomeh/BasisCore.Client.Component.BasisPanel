import { Priority } from "./enum";
import IDisposable from "./IDisposable";
import ISource from "./ISource";
import ISourceOptions from "./ISourceOptions";
import IToken from "./IToken";
import { SourceId } from "./type-alias";
//import { DependencyContainer } from "tsyringe";

export default interface IUserDefineComponent {
  content: DocumentFragment;
  range: Range;
  triggers: string[];
  priority: Priority;
  //container: DependencyContainer;
  toNode(rawHtml: string): Node;
  setContent(newContent: Node): void;
  getAttributeValueAsync(name: string, defaultValue?: string): Promise<string>;
  getAttributeBooleanValueAsync(
    name: string,
    defaultValue?: boolean
  ): Promise<Boolean>;
  getAttributeToken(attributeName: string): IToken<string>;
  addTrigger(sourceIds: Array<SourceId>);
  setSource(
    sourceId: SourceId,
    data: any,
    options?: ISourceOptions,
    preview?: boolean
  ): void;
  tryToGetSource(sourceId: SourceId): ISource;
  waitToGetSourceAsync(sourceId: SourceId): Promise<ISource>;
  getDefault<T>(key: string, defaultValue?: T): T;
  getSetting<T>(key: string, defaultValue: T): T;
  processNodesAsync(nodes: Array<Node>): Promise<IDisposable>;
  disposeAsync(): Promise<void>;
  disposed: boolean;
}
