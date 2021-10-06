import INotificationProviderOptions from "./options/INotificationProviderOptions";
import INotificationComponent from "./INotificationComponent";

export interface INotificationProvider extends INotificationComponent {
    options: INotificationProviderOptions;
    index: number;
}
