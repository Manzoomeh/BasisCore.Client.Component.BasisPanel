import {
  IDisposable,
  ISource,
  ISourceOptions,
  IUserDefineComponent,
} from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";

import INotificationComponent from "./INotificationComponent";
import NotificationProvider from "./NotificationProvider";
import { DependencyContainer } from "tsyringe";

export default class NotificationComponent
  extends BasisPanelChildComponent
  implements INotificationComponent
{
  private _provider: Array<NotificationProvider>;

  public get rKey(): string {
    return this.options.rKey;
  }

  constructor(owner: IUserDefineComponent) {
    super(
      owner,
      desktopLayout,
      mobileLayout,
      "data-bc-bp-notification-container"
    );
    this.container.setAttribute("data-count", "0");
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
    // if (this.deviceId == 2) {
    //   // add event listeners
    //   this.container.querySelector("[data-bc-notification-alert]").addEventListener("click", (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.container.closest("[data-bc-bp-header-items]").classList.toggle("openedNotification");
    //     setTimeout(() => {
    //       this.container.querySelector("[data-bc-notification-dropdown-wrapper]").classList.toggle("active");
    //     }, 200);
    //   });

    //   this.container.querySelector("[data-bc-notification-dropdown-closed]").addEventListener("click", (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.container.querySelector("[data-bc-notification-dropdown-wrapper]").classList.toggle("active");
    //     setTimeout(() => {
    //       this.container.closest("[data-bc-bp-header-items]").classList.toggle("openedNotification");
    //     }, 200);
    //   });
    // }

    this._provider = this.options.notification.providers.map(
      (provider, index) =>
        new NotificationProvider(this, provider, index, this.options.baseUrl)
    );
    const tasks = this._provider.map((x) => x.initializeAsync());
    await Promise.all(tasks);
  }

  public runAsync(source?: ISource) {
    return true;
  }

  public get dc(): DependencyContainer {
    return this.owner.dc;
  }
}
