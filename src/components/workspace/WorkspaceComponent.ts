import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./assets/layout.html";
import "./assets/style.css";

export default class WorkspaceComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-workspace-container");
  }

  public initializeAsync(): void | Promise<void> {}

  public runAsync(source?: ISource) {
    return true;
  }
}
