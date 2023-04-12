import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import ICorporateInfo from "../corporate-selector/ICorporateInfo";
import EntitySelectorComponent, {
  IEntityInfo,
} from "../EntitySelectorComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";

export default class BusinessSelectorComponent extends EntitySelectorComponent {
  protected currentCorporate: ICorporateInfo;
  private cache: Map<number, Array<IEntityInfo>>;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "business");
    this.cache = new Map<number, Array<IEntityInfo>>();
  }

  protected getOwnerUrl(): string {
    return this.options.baseUrl.business;
  }

  protected getListUrl(): string {
    return this.options.dataUrl.business;
  }

  protected getSourceId(): string {
    return DefaultSource.BUSINESS_SOURCE;
  }

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();
    this.owner.addTrigger([
      DefaultSource.CORPORATE_SOURCE,
      DefaultSource.SET_BUSINESS,
    ]);
  }

  public async runAsync(source?: ISource): Promise<any> {
    await super.runAsync(source);
    if (source?.id == DefaultSource.CORPORATE_SOURCE) {
      this.businessComponentFlag = true;
      this.currentCorporate = source.rows[0];
      this.mustReload = true;
      this.fillComboAsync();
      this.clearCombo();
      this.trySelectFromLocalStorageAsync();
    } else if (source?.id == DefaultSource.SET_BUSINESS) {
      const businessId: number = source?.rows[0].value;
      this.trySelectItemSilentAsync(businessId);
    }
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
