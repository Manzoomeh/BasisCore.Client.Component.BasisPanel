/// <reference path="../../@types/typings.d.ts" />

import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import { ISourceOptions, IUserDefineComponent, IDisposable } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import LocalStorageUtil, { IStateModel } from "../../LocalStorageUtil";
import { DefaultSource } from "../../type-alias";

declare const $bc: any;
export default class BasisPanelComponent extends BasisPanelChildComponent {
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-main-container");
    $bc.basisPanel = {};
    LocalStorageUtil.loadLastStateAsync(
      this.options.rKey,
      this.options.checkRkey.url
    );
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    if (!this.runTask) {
      window.addEventListener("popstate", (event) => {
        if (event.state) {
          event.preventDefault();
          const state: IStateModel = event.state;
          LocalStorageUtil.setCurrentState(state);
          if (state.CorporateId) {
            this.owner.setSource(DefaultSource.SET_CORPORATE, state);
          }
          if (state.BusinessId) {
            this.owner.setSource(DefaultSource.SET_BUSINESS, state);
          }
          if (state.PageId) {
            this.owner.setSource(DefaultSource.SET_MENU, state);
          }
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
          openMenu.style.transform = ` scaleY(0)`;
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

  private toggleHeaderMore(elements: Array<Element>) {
    elements.forEach((el) => {
      el.classList.toggle("active");
    });
    document.body.classList.toggle("scrolling");
  }
}
