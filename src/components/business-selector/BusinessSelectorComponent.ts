import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource, PanelLevels } from "../../type-alias";
import ICorporateInfo from "../corporate-selector/ICorporateInfo";
import EntitySelectorComponent, {
  IEntityInfo,
} from "../EntitySelectorComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
declare const $bc: any;

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

  protected getLevel(): PanelLevels {
    return "business";
  }

  public async initializeAsync(): Promise<void> {
    await super.initializeAsync();
    this.owner.addTrigger([DefaultSource.CORPORATE_SOURCE]);
  }

  public async runAsync(source?: ISource): Promise<any> {
    switch (source?.id) {
      case DefaultSource.CORPORATE_SOURCE: {
        this.businessComponentFlag = true;
        this.currentCorporate = source.rows[0];
        this.mustReload = true;
        this.fillComboAsync();
        this.clearCombo();
        this.trySelectFromLocalStorageAsync();
        break;
      }
    }
    return super.runAsync(source);
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

  protected entryListMaker(list) {
    if (this.entityList.length == 0) {
      document.getElementById("ctaForBusinessBuy")?.remove();

      const parentElementForBusiness = this.element.closest(
        "[data-bc-bp-business-container]"
      );

      const buyBusiness = document.createElement("div");
      buyBusiness.setAttribute("id", "ctaForBusinessBuy");
      buyBusiness.innerHTML = `<div data-bc-corporate-buy="">
      <a href="${this.options.businessLink}" target="_blank">
        <span>${this.labels.businessBuy}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#004B85"/>
        </svg>
        </a>
      </div>`;
      parentElementForBusiness.prepend(buyBusiness);
      let businessListMobile = parentElementForBusiness.querySelector(
        "[data-bc-d2-business-list-wrapper]"
      ) as HTMLElement;
      if (businessListMobile) {
        businessListMobile.style.display = "none";
      }
    }
    super.entryListMaker(list);
  }

  protected initLIElement(li: HTMLLIElement, data: IEntityInfo) {
    const lockIcon = document.createElement("span");
    lockIcon.setAttribute("data-bc-business-freeze-btn", "");
    // lockIcon.classList.add("lock-blue-background")
    lockIcon.innerHTML = `<svg width="12" height="15" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.1403 7.58398C4.49863 7.58398 3.97363 8.10898 3.97363 8.75065C3.97363 9.39232 4.49863 9.91732 5.1403 9.91732C5.78197 9.91732 6.30697 9.39232 6.30697 8.75065C6.30697 8.10898 5.78197 7.58398 5.1403 7.58398ZM8.6403 4.66732H8.05697V3.50065C8.05697 1.89065 6.7503 0.583984 5.1403 0.583984C3.8103 0.583984 2.64947 1.48232 2.31697 2.77148C2.2353 3.08648 2.42197 3.40148 2.73697 3.48315C3.04613 3.56482 3.36697 3.37815 3.44863 3.06315C3.64697 2.29315 4.34113 1.75065 5.1403 1.75065C6.1028 1.75065 6.8903 2.53815 6.8903 3.50065V4.66732H1.6403C0.998633 4.66732 0.473633 5.19232 0.473633 5.83398V11.6673C0.473633 12.309 0.998633 12.834 1.6403 12.834H8.6403C9.28197 12.834 9.80697 12.309 9.80697 11.6673V5.83398C9.80697 5.19232 9.28197 4.66732 8.6403 4.66732ZM8.6403 11.084C8.6403 11.4048 8.3778 11.6673 8.05697 11.6673H2.22363C1.9028 11.6673 1.6403 11.4048 1.6403 11.084V6.41732C1.6403 6.09648 1.9028 5.83398 2.22363 5.83398H8.05697C8.3778 5.83398 8.6403 6.09648 8.6403 6.41732V11.084Z" fill="#767676"/></svg>`;
    // lockIcon.classList.add("bs-icons-no-margin")

    lockIcon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await this.setActiveAsync(data.id);
      $bc.setSource(
        "basispanelcomponent_entityselectorcomponent.businessid",
        data.id
      );

      this.selectItem(li, true);
    });
    li.appendChild(lockIcon);
  }
}
