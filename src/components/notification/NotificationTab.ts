import headerLayout from "./assets/header-layout.html";
import contentLayout from "./assets/content-layout.html";
import { INotificationProvider } from "./INotificationProvider";

export default class NotificationTab {
  readonly _owner: INotificationProvider;

  private notificationContainer: Element;
  private optionsName: string;
  private optionConfig: object;
  private optionLink: string;
  private header: Element;
  private contents: Element;
  private alarm: HTMLElement;
  private button: HTMLElement;
  private content: HTMLElement;

  constructor(owner: INotificationProvider, index: number) {
    this._owner = owner;
    
    this.notificationContainer = this._owner.container;
    this.optionsName = this._owner.options.name;
    this.optionConfig = this._owner.options.config;
    this.optionLink = this._owner.options.link;
    this.header = this.notificationContainer.querySelector(
      "[data-bc-notification-tabs]"
    );
    this.contents = this.notificationContainer.querySelector(
      "[data-bc-notification-contents]"
    );
    this.alarm = this.notificationContainer.querySelector(
      "[data-bc-notification-alarm]"
    );

    // create header tabs
    const layout = (headerLayout as any).replaceAll("@name", this.optionsName);
    const headerTemplate = this._owner.toNode(layout);
    this.button = headerTemplate.firstChild as HTMLElement;
    this.button.textContent = this._owner.options.title;
    if (index == 0) {
      this.button.setAttribute("data-bc-notification-tab-button", "active");
    }

    // add event to header tabs
    this.button.onclick = (e) => {
      const tabButton = this.notificationContainer.querySelectorAll(
        "[data-bc-notification-tab-button]"
      );
      const contents = this.notificationContainer.querySelectorAll(
        "[data-bc-notification-tab-content]"
      );

      const id = this.button.getAttribute("data-bc-notification-tab-button-id");
      if (id) {
        tabButton.forEach((btn) => {
          btn.setAttribute("data-bc-notification-tab-button", "");
        });
        this.button.setAttribute("data-bc-notification-tab-button", "active");

        contents.forEach((content) => {
          content.setAttribute("data-bc-notification-tab-content", "");
        });
        const element = this.notificationContainer.querySelector(
          `[data-bc-notification-tab-content-id="${id}"]`
        );
        element.setAttribute("data-bc-notification-tab-content", "active");
      }
    };

    this.header.appendChild(this.button);

    // create contents
    const optionName = `${this.optionsName}_option`;
    let contentTemplate = (contentLayout as any)
      .replaceAll("@dataMemberName", `notification.${this.optionsName}`)
      .replaceAll("@name", this.optionsName)
      .replaceAll("@option", optionName);
    this.content = this._owner.toNode(contentTemplate)
      .firstChild as HTMLElement;

    // console.log(JSON.stringify(this.optionConfig), this.optionConfig);
    Reflect.set(window,optionName,this.optionConfig)
    // this.content.querySelector(
    //   "script"
    // ).innerText = `const ${optionName} = ${JSON.stringify(this.optionConfig)}`;
    if (index == 0) {
      this.content.setAttribute("data-bc-notification-tab-content", "active");
    }
    this.content
      .querySelector("[data-bc-notification-tab-seeMore] a")
      .setAttribute("href", this.optionLink);
    this.contents.appendChild(this.content);
    this._owner.processNodesAsync([this.content]);
  }

  public refreshUI(data: Array<any>) {
    if (data.length > 0) {
      if (this.alarm.style.display == "none") {
        this.alarm.style.display = "block"
      }
      this._owner.setSource(`notification.${this.optionsName}`, data);
      
      console.log("setSource", data);
    }
    console.log("refresh ui", data);
  }
}
