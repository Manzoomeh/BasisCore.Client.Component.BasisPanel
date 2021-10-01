import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
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
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-notification-container");
  }

  public async initializeAsync(): Promise<void> {
    this._provider = this.options.notification.providers.map(
      (provider) => new NotificationProvider(this, provider)
    );
    const tasks = this._provider.map((x) => x.initializeAsync());
    await Promise.all(tasks);
  }

  public runAsync(source?: ISource) {
    return true;
  }
}
