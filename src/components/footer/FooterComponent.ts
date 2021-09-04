import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class FooterComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, "data-bc-bp-footer-container");
  }
}
