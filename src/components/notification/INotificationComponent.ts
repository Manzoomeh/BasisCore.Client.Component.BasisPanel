import { IDisposable, ISourceOptions } from "basiscore";
import { SourceId } from "basiscore";
import { DependencyContainer } from "tsyringe";

export default interface INotificationComponent {
  rKey: string;
  container: Element;
  dc: DependencyContainer;
  storeAsGlobal(
    data: any,
    name?: string,
    prefix?: string,
    postfix?: string
  ): string;
  getRandomName(prefix?: string, postfix?: string): string;
  toNode(rawHtml: string): Node;
  setSource(sourceId: SourceId, data: any, options?: ISourceOptions): void;
  processNodesAsync(nodes: Array<Node>): Promise<IDisposable>;
}
