import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./assets/layout.html";
import "./assets/style.css";

export default class WorkspaceComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-workspace-container");
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE]);
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      console.log(source.rows[0]);
    }
    return true;
  }
}
