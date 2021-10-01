import INotificationComponent from "./INotificationComponent";
import { INotificationProviderOptions } from "./options/INotificationProviderOptions";

export default class NotificationProvider {
  readonly _owner: INotificationComponent;
  readonly _options: INotificationProviderOptions;
  constructor(
    owner: INotificationComponent,
    options: INotificationProviderOptions
  ) {
    this._owner = owner;
    this._options = options;
    console.log(this._options);
  }

  public initializeAsync(): Promise<void> {
    //TODO: start fetch data from url and display related list
    return Promise.resolve();
  }
}
