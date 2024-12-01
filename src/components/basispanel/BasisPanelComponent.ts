/// <reference path="../../@types/typings.d.ts" />

import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import {
  ISourceOptions,
  IUserDefineComponent,
  IDisposable,
  BCWrapperFactory,
} from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import LocalStorageUtil from "../../LocalStorageUtil";
import IStateModel from "../menu/IStateModel";
import { DefaultSource, PanelLevels } from "../../type-alias";
import HttpUtil from "../../HttpUtil";

declare const $bc: BCWrapperFactory;
export default class BasisPanelComponent extends BasisPanelChildComponent {
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-main-container");
    LocalStorageUtil.loadLastStateAsync(
      this.options.rKey,
      this.options.checkRkey.url,
      this.options.urlPrefix
    ).then(async () => {
      if (LocalStorageUtil.level != "profile") {
        if (LocalStorageUtil.corporateId) {
          await this.setActiveAsync(LocalStorageUtil.corporateId, "corporate");
        }
        if (LocalStorageUtil.level == "business") {
          if (LocalStorageUtil.businessId) {
            await this.setActiveAsync(LocalStorageUtil.businessId, "business");
          }
        }
      }
    });
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    if (!this.runTask) {
      window.addEventListener("popstate", async (event) => {
        if (event.state) {
          event.preventDefault();
          const state: IStateModel = event.state;
          if (
            state.corporateId &&
            state.corporateId != LocalStorageUtil.corporateId
          ) {
            await this.setActiveAsync(state.corporateId, "corporate");
          }
          if (
            state.businessId &&
            state.businessId != LocalStorageUtil.businessId
          ) {
            await this.setActiveAsync(state.businessId, "business");
          }
          LocalStorageUtil.setLastState(state);
          this.owner.setSource(DefaultSource.SET_STATE, state);
        }
      });

      this.runTask = this.owner.processNodesAsync(
        Array.from(this.container.childNodes)
      );
    }
    return this.runTask;
  }

  public async initializeAsync(): Promise<void> {
    const style = await this.owner.getAttributeValueAsync("style");
    if (style) {
      this.container.setAttribute("style", style);
    }

    this.container
      .querySelector("[data-bc-bp-main-header] [data-bc-bp-logo] a")
      ?.setAttribute("href", this.options.logo);

    if (this.deviceId == 2) {
      // add Event Listeners
      const openedMore = this.container.querySelector(
        "[data-bc-bp-header-more-opened]"
      );
      const closedMore = this.container.querySelector(
        "[data-bc-bp-header-more-closed]"
      );
      const navbarMore = this.container.querySelector(
        "[data-bc-bp-header-more-container]"
      );

      openedMore.addEventListener("click", (e) => {
        this.toggleHeaderMore([navbarMore]);
      });
      closedMore.addEventListener("click", (e) => {
        this.toggleHeaderMore([navbarMore]);
      });

      const openedHeaderLevels = this.container.querySelector(
        "[data-bc-bp-header-levels-opened]"
      );
      openedHeaderLevels.addEventListener("click", (e) => {
        this.container
          .querySelector("[data-bc-bp-header-levels]")
          .classList.toggle("active");
      });

      const closedHeaderLevels = this.container.querySelector(
        "[data-bc-bp-header-levels-back]"
      );
      closedHeaderLevels.addEventListener("click", (e) => {
        this.container
          .querySelector("[data-bc-bp-header-levels]")
          .classList.toggle("active");
      });
    }

    this.container.addEventListener("click", function (e) {
      const currentElement = e.target as HTMLElement;

      // for close userinfo drop down
      if (
        currentElement.getAttribute("data-bc-bp-logout-wrapper") === null &&
        currentElement.getAttribute("data-bc-user-info-image") === null &&
        currentElement.getAttribute("data-bc-user-image") === null &&
        currentElement.getAttribute("data-bc-bp-logout-container") === null &&
        currentElement.getAttribute("data-bc-bp-logout-title") === null &&
        currentElement.getAttribute("data-bc-bp-logout-modal") === null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-background") ===
          null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-content") ===
          null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-body") === null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-body-text") ===
          null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-footer") ===
          null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-buttons") ===
          null &&
        currentElement.getAttribute("data-bc-bp-logout-modal-button") === null
      ) {
        document
          .querySelector("[data-bc-user-info]")
          ?.setAttribute("data-status", "close");
      }

      // for close menu
      if (currentElement.getAttribute("data-bc-level-open") === null) {
        const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
        openMenu.forEach((x) => {
          const openMenu = x as HTMLElement;
          openMenu.style.maxHeight = ` 0px`;
          openMenu.previousElementSibling.removeAttribute("data-bc-level-open");
          openMenu.removeAttribute("data-bc-ul-level-open");
        });
      }

      // for close corporate drop down
      if (
        currentElement.getAttribute("data-bc-drop-down-click") === null &&
        currentElement.getAttribute("data-bc-corporate-icon-drop-down") ===
          null &&
        currentElement.getAttribute("data-bc-corporate-search-input") ===
          null &&
        currentElement.getAttribute("data-bc-corporate-drop-down-wrapper") ===
          null &&
        currentElement.getAttribute("data-bc-corporate-drop-down-title") ===
          null
      ) {
        document
          .querySelector("[data-bc-corporate-drop-down]")
          ?.setAttribute("data-status", "close");
      }

      // for close business drop down
      if (
        currentElement.getAttribute("data-bc-drop-down-click") === null &&
        currentElement.getAttribute("data-bc-business-icon-drop-down") ===
          null &&
        currentElement.getAttribute("data-bc-business-search-input") === null &&
        currentElement.getAttribute("data-bc-business-drop-down-wrapper") ===
          null &&
        currentElement.getAttribute("data-bc-business-drop-down-title") === null
      ) {
        document
          .querySelector("[data-bc-business-drop-down]")
          ?.setAttribute("data-status", "close");
      }
    });
  }

  protected async setActiveAsync(id: number, level: PanelLevels) {
    const url = HttpUtil.formatString(this.options.baseUrl.active, {
      rKey: this.options.rKey,
    });
    await HttpUtil.checkRkeyFetchDataAsync(
      url,
      "POST",
      this.options.checkRkey,
      {
        type: level,
        id: id,
      }
    );
  }

  private toggleHeaderMore(elements: Array<Element>) {
    elements.forEach((el) => {
      el.classList.toggle("active");
    });
    document.body.classList.toggle("scrolling");
  }
}
