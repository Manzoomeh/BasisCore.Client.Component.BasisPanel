import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout.html";
import "./assets/style.css";

export default class StoreComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, desktopLayout, "data-bc-bp-store-container");
  }

  public initializeAsync(): Promise<void> {
    this.container.setAttribute("data-sys-hover", "");
    this.container
      ?.addEventListener("click", async (e) => {
        e.preventDefault();
        window.location.href = this.options.store.url;
      });
    
    return Promise.resolve();
  }

  public runAsync(source?: ISource) {
    return true;
  }
}