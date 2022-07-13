/// <reference path="../../@types/typings.d.ts" />

import "./assets/style.css";
import layout from "./assets/layout.html";
import { ISourceOptions, IUserDefineComponent, IDisposable } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import LocalStorageUtil from "../../LocalStorageUtil";

declare const $bc: any;
export default class BasisPanelComponent extends BasisPanelChildComponent {
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-main-container");
    $bc.basisPanel = {};
    LocalStorageUtil.loadLastState();
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    if (!this.runTask) {
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

    this.container.addEventListener("click", function (e) {
      const currentElement = e.target as HTMLElement;

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
        currentElement.getAttribute("data-bc-corporate-search-input") === null
      ) {
        document
          .querySelector("[data-bc-corporate-drop-down]")
          .setAttribute("data-status", "close");
      }

      // for close business drop down
      if (
        currentElement.getAttribute("data-bc-drop-down-click") === null &&
        currentElement.getAttribute("data-bc-business-icon-drop-down") ===
          null &&
        currentElement.getAttribute("data-bc-business-search-input") === null
      ) {
        document
          .querySelector("[data-bc-business-drop-down]")
          .setAttribute("data-status", "close");
      }
    });
  }
}
