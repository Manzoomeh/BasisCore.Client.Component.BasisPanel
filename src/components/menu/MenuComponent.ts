import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class MenuComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, "data-bc-bp-menu-container");
  }
}
