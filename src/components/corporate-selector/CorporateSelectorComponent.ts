import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import EntitySelectorComponent from "../EntitySelectorComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";

export default class CorporateSelectorComponent extends EntitySelectorComponent {
  private dataLoaded = false;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "corporate");
  }

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();
    this.owner.addTrigger([DefaultSource.SET_CORPORATE]);
  }
  protected getSourceId(): string {
    return DefaultSource.CORPORATE_SOURCE;
  }

  protected getOwnerUrl(): string {
    return this.options.baseUrl.corporate;
  }

  protected getListUrl(): string {
    return this.options.dataUrl.corporate;
  }

  protected async fillComboAsync() {
    if (!this.dataLoaded) {
      await super.fillComboAsync();
      this.dataLoaded = true;
    }
  }

  public async runAsync(source?: ISource): Promise<any> {
    await super.runAsync(source);
    if (source?.id == DefaultSource.USER_INFO_SOURCE) {
      await this.trySelectFromLocalStorageAsync();
    } else if (source?.id == DefaultSource.SET_CORPORATE) {
      await this.trySelectFromLocalStorageAsync();
    }
  }
}
