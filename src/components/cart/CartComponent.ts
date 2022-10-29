import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout.html";
import "./assets/style.css";

export default class CartComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, desktopLayout, "data-bc-bp-cart-container");
  }

  public initializeAsync(): Promise<void> {    
    return Promise.resolve();
  }

  public runAsync(source?: ISource) {
    return true;
  }
}