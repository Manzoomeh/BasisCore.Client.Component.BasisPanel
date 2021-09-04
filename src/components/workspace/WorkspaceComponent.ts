import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class WorkspaceComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, "data-bc-bp-workspace-container");
  }
}
