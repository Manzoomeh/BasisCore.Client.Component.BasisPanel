import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import HttpUtil from "../../HttpUtil";
import { DefaultSource } from "../../type-alias";
import IProfileInfo from "../accounting/IProfileInfo";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { IMenuLoaderParam } from "../menu/IMenuInfo";
import html from "./assets/layout.html";
import "./assets/style.css";
import ICorporateInfo from "./ICorporateInfo";

export default class CorporateSelectorComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;
  private element: HTMLOptionElement;
  private dataLoaded = false;
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-corporate-container");
  }

  public initializeAsync(): void | Promise<void> {
    this.element = this.container.querySelector<HTMLOptionElement>(
      "[data-bc-main-list]"
    );
    this.element.addEventListener("click", async (e) => {
      if (!this.dataLoaded) {
        e.preventDefault();
        await this.loadCorporateAsync();
        this.dataLoaded = true;
      }
    });

    this.element.addEventListener("change", (e) => {
      e.preventDefault();
      console.log(this.element.value);
      this.signalToDisplayMenu();
    });
    this.owner.addTrigger([DefaultSource.USER_INFO_SOURCE]);
  }

  public async runAsync(source?: ISource) {
    switch (source?.id) {
      case DefaultSource.USER_INFO_SOURCE: {
        this.profile = source.rows[0];
        await this.loadCorporateAsync();
        break;
      }
      case DefaultSource.USER_INFO_SOURCE: {
        this.profile = source.rows[0];
        break;
      }
    }
    return true;
  }

  private async loadCorporateAsync() {
    const corporateList = await HttpUtil.formatAndGetDataAsync<
      Array<ICorporateInfo>
    >(this.options.corporateUrl, this.options.rKey, this.profile);
    corporateList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id.toString();
      option.text = item.title;
      this.element.appendChild(option);
    });
  }

  private signalToDisplayMenu() {
    if (this.profile) {
      const menuInfo: IMenuLoaderParam = {
        type: "corporate",
        key: parseInt(this.element.value),
        profile: this.profile,
        rawUrl: this.options.corporateMenuUrl,
        rKey: this.options.rKey,
      };
      this.owner.setSource(DefaultSource.SHOW_MENU, menuInfo);
    }
  }
}
