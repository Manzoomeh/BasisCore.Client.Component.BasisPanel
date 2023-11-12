import contentLayout from "./assets/content-layout.html";
import { INotificationProvider } from "./INotificationProvider";

export default class NotificationTab {
  readonly _owner: INotificationProvider;

  private notificationContainer: Element;
  private optionsName: string;
  private optionsRkey: string;
  private optionConfig: object;
  private contents: Element;
  private alarm: HTMLElement;
  private content: HTMLElement;

  constructor(owner: INotificationProvider, index: number) {
    this._owner = owner;

    this.notificationContainer = this._owner.container;
    this.optionsName = this._owner.options.name;
    this.optionsRkey = this._owner.options.rKey;
    this.optionConfig = this._owner.options.config;
    this.contents = this.notificationContainer.querySelector(
      "[data-bc-notification-contents]"
    );
    this.alarm = this.notificationContainer.querySelector(
      "[data-bc-notification-alarm]"
    );


    // create contents
    const optionName = this._owner.storeAsGlobal(this.optionConfig); //`${this.optionsName}_option`;
    
    let contentTemplate = (contentLayout as any)
      .replaceAll("@dataMemberName", `notification.${this.optionsName}`)
      .replaceAll("@memberName", `${this.optionsName}`)
      .replaceAll("@rkey", this.optionsRkey)
      .replaceAll("@name", this.optionsName)
      .replaceAll("@option", optionName);

    this.content = this._owner.toNode(contentTemplate)
      .firstChild as HTMLElement;
    if (index == 0) {
      this.content.setAttribute("data-bc-notification-tab-content", "active");
    }
    this.contents.appendChild(this.content);
    this._owner.processNodesAsync([this.content]);

    this.contents.querySelector("[data-bc-notification-read-button]")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._owner.setSource("notification.type", "read");
    });
  }

  public refreshUI(data: Array<any>) {
    if (data.length > 0) {
      if (this.alarm.style.display == "none") {
        this.alarm.style.display = "block";
      }
    }
    this._owner.setSource(`notification.${this.optionsName}`, data);
  }
}
