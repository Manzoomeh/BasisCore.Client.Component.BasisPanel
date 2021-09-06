import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import EntitySelectorComponent from "../EntitySelectorComponent";
import html from "./assets/layout.html";
import "./assets/style.css";

export default class CorporateSelectorComponent extends EntitySelectorComponent {
  private dataLoaded = false;

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "corporate");
  }

  protected getSourceId(): string {
    return DefaultSource.CORPORATE_SOURCE;
  }

  protected getMenuUrl(): string {
    return this.options.corporateMenuUrl;
  }

  protected getListUrl(): string {
    return this.options.corporateUrl;
  }

  protected async fillComboAsync() {
    if (!this.dataLoaded) {
      await super.fillComboAsync();
      this.dataLoaded = true;
    }
  }
}
