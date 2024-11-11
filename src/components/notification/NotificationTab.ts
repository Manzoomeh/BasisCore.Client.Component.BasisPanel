import contentLayout from "./assets/content-layout.html";
import { INotificationProvider } from "./INotificationProvider";
import { IUrlCollectionOption } from "../basispanel/IBasisPanelOptions";
import { BCWrapperFactory } from "basiscore";
import LocalStorageUtil from "../../LocalStorageUtil";
import MenuComponent from "../menu/MenuComponent";

declare const $bc: BCWrapperFactory;
export default class NotificationTab {
  readonly _owner: INotificationProvider;

  private notificationContainer: Element;
  private optionsName: string;
  private optionsRkey: string;
  private optionConfig: object;
  private contents: Element;
  private alarm: HTMLElement;
  private content: HTMLElement;

  constructor(
    owner: INotificationProvider,
    index: number,
    baseUrls: IUrlCollectionOption
  ) {
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
      // .replaceAll("@dataMemberName", `notification.${this.optionsName}`)
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

    // event read button
    this.contents
      .querySelector("[data-bc-notification-read-button]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const listContainer = this.contents.querySelector(
          "[data-bc-notification-tab-list]"
        );
        const listItems = listContainer.querySelectorAll(
          "[data-bc-notification-items]"
        );
        const listItemsArray = [];
        listItems.forEach((element) => {
          listItemsArray.push(element.getAttribute("data-bc-notification-id"));
        });
        const listItemsString = listItemsArray.join(",");
        this._owner.setSource("notification.websocket", {
          type: "read",
          usedforid: listItemsString,
        });
      });

    // event view button
    this.contents
      .querySelector("[data-bc-notification-view-button]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        let pageId = 0;

        if (
          LocalStorageUtil.businessId > 0 &&
          LocalStorageUtil.level == "corporate"
        ) {
          pageId = 69;
        } else if (
          LocalStorageUtil.corporateId > 0 &&
          LocalStorageUtil.level == "corporate"
        ) {
          pageId = 99;
        } else if (LocalStorageUtil.level == "profile") {
          pageId = 20;
        }
        const pageLoader = this._owner.dc.resolve<MenuComponent>("page_loader");
        pageLoader.tryLoadPage(LocalStorageUtil.level, 1, 1, pageId, false);
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
