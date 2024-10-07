import NotificationTab from "./NotificationTab";
import INotificationComponent from "./INotificationComponent";
import INotificationProviderOptions from "./options/INotificationProviderOptions";
import { INotificationProvider } from "./INotificationProvider";
import { IDisposable, ISourceOptions } from "basiscore"; //"bclib/dist/bclib";
//import ISourceOptions from "basiscore";
import HttpUtil from "../../HttpUtil";
import { IUrlCollectionOption } from "../basispanel/IBasisPanelOptions";
//import ISource from "basiscore";

export default class NotificationProvider implements INotificationProvider {
  readonly _owner: INotificationComponent;
  readonly options: INotificationProviderOptions;
  get container(): Element {
    return this._owner.container;
  }
  get rKey(): string {
    return this._owner.rKey;
  }
  public readonly tab: NotificationTab;

  constructor(
    owner: INotificationComponent,
    options: INotificationProviderOptions,
    index: number,
    baseUrl: IUrlCollectionOption
  ) {
    this._owner = owner;
    this.options = options;

    this.tab = new NotificationTab(this, index, baseUrl);
  }

  storeAsGlobal(
    data: any,
    name?: string,
    prefix?: string,
    postfix?: string
  ): string {
    return this._owner.storeAsGlobal(data, name, prefix, postfix);
  }

  getRandomName(prefix?: string, postfix?: string): string {
    return this._owner.getRandomName(prefix, postfix);
  }

  setSource(sourceId: string, data: any, options?: ISourceOptions): void {
    this._owner.setSource(sourceId, data, options);
  }

  processNodesAsync(nodes: Node[]): Promise<IDisposable> {
    return this._owner.processNodesAsync(nodes);
  }

  index: number;

  public toNode(rawHtml: string): Node {
    return this._owner.toNode(rawHtml);
  }

  public initializeAsync(): Promise<void> {
    // this.loadDataAsync();

    return Promise.resolve();
  }

  // public runAsync(source?: ISource) {
  //   console.log("runAsync")
  //   return true;
  // }

  public async loadDataAsync(): Promise<void> {
    //TODO: start fetch data from url and display related list
    const url = HttpUtil.formatString(this.options.url, {
      rKey: this.rKey,
    });
    const result = await HttpUtil.fetchDataAsync<Array<any>>(url, "GET");

    this.tab.refreshUI(result);
  }
}
