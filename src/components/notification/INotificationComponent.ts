import IDisposable from "../../basiscore/IDisposable";
import ISourceOptions from "../../basiscore/ISourceOptions";
import { SourceId } from "../../basiscore/type-alias";

export default interface INotificationComponent {
    rkey: string;
    container: Element;
    storeAsGlobal(data: any, name?: string, prefix?: string, postfix?: string): string;
    getRandomName(prefix?:string,postfix?:string):string;
    toNode(rawHtml: string): Node;
    setSource(
        sourceId: SourceId,
        data: any,
        options?: ISourceOptions
      ): void;
    processNodesAsync(nodes: Array<Node>): Promise<IDisposable>;
}
