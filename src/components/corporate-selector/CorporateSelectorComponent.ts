import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource, PanelLevels } from "../../type-alias";
import EntitySelectorComponent, {
  IEntityInfo,
} from "../EntitySelectorComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";

export default class CorporateSelectorComponent extends EntitySelectorComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "corporate");
  }

  protected getSourceId(): string {
    return DefaultSource.CORPORATE_SOURCE;
  }

  protected getLevelUrl(): string {
    return this.options.baseUrl.corporate;
  }

  protected getListUrl(): string {
    return this.options.dataUrl.corporate;
  }

  protected getLevel(): PanelLevels {
    return "corporate";
  }

  public async runAsync(source?: ISource): Promise<any> {
    await super.runAsync(source);
    if (source?.id == DefaultSource.USER_INFO_SOURCE) {
      if (this.mustReload) {
        const corporateList = await this.getEntitiesAsync();

        if (corporateList.length > 0) {
          if (this.deviceId == 1) {
            const corporateElement = this.element
              .closest("[data-bc-bp-main-header]")
              .querySelector("[data-bc-corporate-list]") as HTMLElement;
            corporateElement.style.transform = "scaleY(1)";
          }
        } else {
          let serviceListMobile = document.querySelector(
            "[data-bc-corporate-list]"
          ) as HTMLElement;
          if (serviceListMobile) {
            serviceListMobile.style.display = "none";
          }
          let businessListMobile = document.querySelector(
            "[data-bc-bp-business-container]"
          ) as HTMLElement;
          if (businessListMobile) {
            businessListMobile.style.display = "none";
          }
          const parentElement = this.element.closest(
            "[data-bc-bp-corporate-container]"
          );
          const buyService = document.createElement("div");
          buyService.innerHTML = `<div data-bc-corporate-buy="">
        <a href="${this.options.serviceLink}" target="_blank">
          <span>${this.labels.corporateBuy}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#004B85"/>
          </svg>
          </a>
        </div>`;
          parentElement.prepend(buyService);
          if (this.deviceId == 1) {
            const buyServiceElement = buyService.querySelector(
              "[data-bc-corporate-buy]"
            ) as HTMLElement;
            setTimeout(function () {
              buyServiceElement.style.transform = "scaleY(1)";
            }, 100);
          }
        }
      }
      await this.trySelectFromLocalStorageAsync();
    } else if (source?.id == DefaultSource.SET_STATE) {
      this.mustReload = true;
    }
  }

  protected initLIElement(li: HTMLLIElement, data: IEntityInfo) {
    if (data.erp) {
      const erpIcon = document.createElement("span");
      erpIcon.setAttribute("data-bc-erp-icon", "");
      erpIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.23826 1.97656L1.01312 2.76455H1.4634L0.652902 5.53375H0.247652L0 6.34425H3.62473L4.05249 4.90336H3.17445L2.97183 5.53375H1.75608L2.07127 4.43057H3.0844L3.26451 3.73264H2.25139L2.56658 2.76455H3.66976L3.48965 3.41745H4.27763L4.72791 1.97656H1.23826Z" fill="#004B85"/>
      <path d="M7.19093 5.77894C7.30349 5.7114 7.41606 5.68889 7.55115 5.64386C8.04645 5.46375 8.22656 4.85587 8.22656 4.38308C8.22656 3.4375 7.34852 3.4375 7.34852 3.4375H4.69189L4.46675 4.22549H4.91703L4.2191 6.97218H3.88139L3.65625 7.80519H5.59244L5.84009 6.97218H5.3673L5.65998 5.89151H6.20032L6.67311 7.80519H7.84383L8.02394 6.97218H7.61869C7.43858 6.58944 7.25847 6.18419 7.19093 5.77894ZM7.03333 4.69828C6.94327 5.0585 6.76316 5.17107 6.56054 5.17107C6.35791 5.17107 5.72752 5.17107 5.72752 5.17107L5.97518 4.22549H6.71813C6.71813 4.22549 7.12338 4.27051 7.03333 4.69828Z" fill="#004B85"/>
      <path d="M11.1026 5.63281H8.40098L8.22087 6.4208H8.67114L7.97321 9.19H7.50042L7.32031 10.023H9.4141L9.59421 9.19H9.12142L9.36907 8.10934C9.36907 8.10934 10.6974 8.10934 10.7649 8.10934C10.8325 8.10934 10.9901 8.06431 11.0351 8.0418C11.4178 7.8842 11.5979 7.74911 11.7781 7.45643C11.9582 7.18627 12.0032 6.9161 12.0032 6.60091C11.9807 5.63281 11.1026 5.63281 11.1026 5.63281ZM10.8325 6.89359C10.7424 7.25381 10.5623 7.36638 10.3597 7.36638C10.1571 7.36638 9.52667 7.36638 9.52667 7.36638L9.77432 6.4208H10.4948C10.5173 6.4208 10.945 6.46583 10.8325 6.89359Z" fill="#004B85"/>
      </svg>
      `;
      li.appendChild(erpIcon);
    }
  }
}
