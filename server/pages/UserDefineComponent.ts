import { inject, DependencyContainer, injectable } from "tsyringe";
import ComponentCollection from "../../ComponentCollection";
import IContext from "../../context/IContext";
import ISourceOptions from "../../context/ISourceOptions";
import ISource from "../../data/ISource";
import IDisposable from "../../IDisposable";
import { SourceId } from "../../type-alias";
import IBCUtil from "../../wrapper/IBCUtil";
import CommandComponent from "../CommandComponent";
import IComponentManager from "./IComponentManager";
import IUserDefineComponent from "./IUserDefineComponent";

declare const $bc: IBCUtil;
@injectable()
export default class UserDefineComponent
  extends CommandComponent
  implements IUserDefineComponent
{
  readonly dc: DependencyContainer;
  private collections: Array<ComponentCollection>;
  private manager: IComponentManager;

  constructor(
    @inject("element") element: Element,
    @inject("context") context: IContext,
    @inject("container") container: DependencyContainer
  ) {
    super(element, context);
    this.dc = container;
  }

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();
    const lib = this.core.slice(this.core.indexOf(".") + 1);
    const manager = await $bc.util.getComponentAsync(this.context, lib);
    this.manager = Reflect.construct(manager, [this]);
    if (this.manager.initializeAsync) {
      await this.manager.initializeAsync();
    }
  }
  protected runAsync(source?: ISource): Promise<any> {
    return this.manager.runAsync
      ? this.manager.runAsync(source)
      : Promise.resolve();
  }

  public toNode(rawHtml: string): DocumentFragment {
    return $bc.util.toNode(rawHtml);
  }

  public toHTMLElement(rawXml: string): HTMLElement {
    return $bc.util.toHTMLElement(rawXml);
  }

  public setContent(newContent: Node) {
    this.range.setContent(newContent);
  }

  public getDefault<T>(key: string, defaultValue?: T): T {
    return this.context.options.getDefault<T>(key, defaultValue);
  }

  public getSetting<T>(key: string, defaultValue: T): T {
    return this.context.options.getSetting<T>(key, defaultValue);
  }

  public setSource(
    sourceId: SourceId,
    data: any,
    options?: ISourceOptions,
    preview?: boolean
  ): void {
    this.context.setAsSource(sourceId, data, options, preview);
  }

  public tryToGetSource(sourceId: SourceId): ISource {
    return this.context.tryToGetSource(sourceId);
  }

  public waitToGetSourceAsync(sourceId: SourceId): Promise<ISource> {
    return this.context.waitToGetSourceAsync(sourceId);
  }

  public async processNodesAsync(nodes: Array<Node>): Promise<IDisposable> {
    const newCollection = this.dc.resolve(ComponentCollection);
    if (!this.collections) {
      this.collections = new Array<ComponentCollection>();
    }
    this.collections.push(newCollection);
    await newCollection.processNodesAsync(nodes);
    return newCollection;
  }

  public async disposeAsync(): Promise<void> {
    const tasks = this.collections?.map((collection) =>
      collection.disposeAsync()
    );
    await Promise.all(tasks);
    return super.disposeAsync();
  }

  public storeAsGlobal(
    data: any,
    name?: string,
    prefix?: string,
    postfix?: string
  ): string {
    return $bc.util.storeAsGlobal(data, name, prefix, postfix);
  }

  public getRandomName(prefix?: string, postfix?: string): string {
    return $bc.util.getRandomName(prefix, postfix);
  }

  public format(pattern: string, ...params: any[]): string {
    return $bc.util.format(pattern, params);
  }
}
