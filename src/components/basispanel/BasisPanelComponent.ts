/// <reference path="../../@types/typings.d.ts" />

import "./assets/style.css";
import layout from "./assets/layout.html";
import { ISourceOptions, IUserDefineComponent, IDisposable } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

declare const $bc: any;
export default class BasisPanelComponent extends BasisPanelChildComponent {
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-main-container");
    $bc.basisPanel = {};
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
      if (currentElement.getAttribute("data-bc-level-open") === null) {
        const openMenu = document.querySelectorAll("[data-bc-ul-level-open]");
        openMenu.forEach((x) => {
          const openMenu = x as HTMLElement;
          openMenu.style.transform = ` scaleY(0)`;
          openMenu.previousElementSibling.removeAttribute("data-bc-level-open");
          openMenu.removeAttribute("data-bc-ul-level-open");
        });
      }
    });
  }
}
