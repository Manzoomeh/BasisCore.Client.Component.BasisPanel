import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";

export default class CartComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-cart-container");
  }

  public initializeAsync(): Promise<void> {
    this.container.setAttribute("data-count", "0");
    this.container.querySelector("[data-bc-cart]").setAttribute("href", this.options.cart.url);

    return Promise.resolve();
  }

  public runAsync(source?: ISource) {
    return true;
  }
}