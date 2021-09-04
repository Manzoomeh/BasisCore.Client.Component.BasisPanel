import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class CorporateSelectorComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, "data-bc-bp-corporate-container");
  }
}
