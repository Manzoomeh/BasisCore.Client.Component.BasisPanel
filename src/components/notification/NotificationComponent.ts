import {
  IDisposable,
  ISource,
  ISourceOptions,
  IUserDefineComponent,
} from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";

import INotificationComponent from "./INotificationComponent";
import NotificationProvider from "./NotificationProvider";

export default class NotificationComponent
  extends BasisPanelChildComponent
  implements INotificationComponent
{
  private _provider: Array<NotificationProvider>;

  public get rKey(): string {
    return this.options.rKey;
  }

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-notification-container");
  }

  storeAsGlobal(
    data: any,
    name?: string,
    prefix?: string,
    postfix?: string
  ): string {
    return this.owner.storeAsGlobal(data, name, prefix, postfix);
  }

  getRandomName(prefix?: string, postfix?: string): string {
    return this.owner.getRandomName(prefix, postfix);
  }

  public toNode(rawHtml: string): Node {
    return this.owner.toNode(rawHtml);
  }

  processNodesAsync(nodes: Node[]): Promise<IDisposable> {
    return this.owner.processNodesAsync(nodes);
  }

  setSource(sourceId: string, data: any, options?: ISourceOptions): void {
    this.owner.setSource(sourceId, data, options);
  }

  public async initializeAsync(): Promise<void> {
    this._provider = this.options.notification.providers.map(
      (provider, index) => new NotificationProvider(this, provider, index)
    );
    const tasks = this._provider.map((x) => x.initializeAsync());
    await Promise.all(tasks);
  }

  public runAsync(source?: ISource) {
    return true;
  }
}
