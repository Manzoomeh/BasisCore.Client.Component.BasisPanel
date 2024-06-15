import { DefaultSource } from "../../type-alias";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import contentLayout from "./assets/content-layout.html";
import { INotificationProvider } from "./INotificationProvider";

declare const $bc: any;
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

        // read info from local storage
        const str = localStorage.getItem("__bc_panel_last_state__");
        const obj = JSON.parse(str);
        let pageId = "0";
        switch (obj.p.owner) {
          case "profile":
            pageId = "20";
            break;
          case "corporate":
            pageId = "99";
            break;
          case "business":
            pageId = "69";
            break;
          default:
            pageId = "0";
        }

        // load page
        const newParam: IPageLoaderParam = {
          owner: obj.p.owner,
          ownerId: "",
          ownerUrl: obj.p.ownerUrl,
          pageId: pageId,
          rKey: this.optionsRkey,
          pageMethod: obj.p.pageMethod,
          module: obj.p.module,
        };

        $bc.setSource(DefaultSource.DISPLAY_PAGE, newParam);

        const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
        activeMenus.forEach((e) => {
          e.removeAttribute("data-bc-menu-active");
        });
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
