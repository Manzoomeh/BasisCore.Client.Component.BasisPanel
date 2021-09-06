import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import ICorporateInfo from "../corporate-selector/ICorporateInfo";
import EntitySelectorComponent, {
  IEntityInfo,
} from "../EntitySelectorComponent";
import html from "./assets/layout.html";
import "./assets/style.css";

export default class BusinessSelectorComponent extends EntitySelectorComponent {
  protected currentCorporate: ICorporateInfo;
  private cache: Map<number, Array<IEntityInfo>>;

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "business");
    this.cache = new Map<number, Array<IEntityInfo>>();
  }

  protected getMenuUrl(): string {
    return this.options.businessMenuUrl;
  }

  protected getListUrl(): string {
    return this.options.businessUrl;
  }

  protected getSourceId(): string {
    return DefaultSource.BUSINESS_SOURCE;
  }

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();
    this.owner.addTrigger([DefaultSource.CORPORATE_SOURCE]);
  }

  public async runAsync(source?: ISource): Promise<any> {
    switch (source?.id) {
      case DefaultSource.CORPORATE_SOURCE: {
        this.currentCorporate = source.rows[0];
        if (this.cache.has(this.currentCorporate.id)) {
          await this.fillComboAsync();
        } else {
          this.clearCombo();
        }
        break;
      }
    }
    return super.runAsync(source);
  }

  protected getExtraData(): any {
    return this.currentCorporate
      ? { corporate: this.currentCorporate.id }
      : null;
  }

  protected async getEntitiesAsync(): Promise<Array<IEntityInfo>> {
    let retVal: Array<IEntityInfo> = null;
    if (this.currentCorporate) {
      retVal = this.cache.get(this.currentCorporate.id);
      if (!retVal) {
        retVal = await super.getEntitiesAsync();
        this.cache.set(this.currentCorporate.id, retVal);
      }
    }
    return retVal;
  }
}
