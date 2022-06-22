import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import EntitySelectorComponent from "../EntitySelectorComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";

export default class CorporateSelectorComponent extends EntitySelectorComponent {
  private dataLoaded = false;
  private _isFirst = true;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "corporate");
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
    if (source?.id == DefaultSource.USER_INFO_SOURCE && this._isFirst) {
      this._isFirst = true;
      this.trySelectAsync(1);
    }
  }
}
