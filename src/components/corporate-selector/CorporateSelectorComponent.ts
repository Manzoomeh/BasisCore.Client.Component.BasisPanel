import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
const html = "";

export default class CorporateSelectorComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-corporate-container");
  }

  public initializeAsync(): void | Promise<void> {}

  public runAsync(source?: ISource) {
    return true;
  }
}
