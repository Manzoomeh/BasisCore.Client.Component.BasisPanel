
import ISource from "../../basiscore/ISource";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import "./assets/style.css";
export default class WidgetBox extends BasisPanelChildComponent {
    constructor(owner: IUserDefineComponent) {
        super(owner, layout, "data-bc-bp-profile-container");
      }
    public initializeAsync(): void | Promise<void> {
       
      }
      public runAsync(source?: ISource) {}
}