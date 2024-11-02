import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { DefaultSource, IQuestionItem } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { IUserDefineComponent, ISource, IDependencyContainer } from "basiscore";
import { IMenuLoaderParam } from "../menu/IMenuInfo";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import LocalStorageUtil from "../../LocalStorageUtil";
import IProfileAccessor from "./IProfileAccessor";

export default class ProfileComponent
  extends BasisPanelChildComponent
  implements IProfileAccessor
{
  private profile: IProfileInfo;

  public getCurrent(): IProfileInfo {
    return this.profile;
  }
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-profile-container");
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("ProfileAccessor", this);
  }

  public runAsync(source?: ISource): Promise<any> {
    return this.loadDataAsync();
  }

  public initializeAsync(): Promise<void> {
    const nodes = this.container.querySelectorAll("basis");
    if (nodes) {
      nodes.forEach((node) => {
        this.owner.processNodesAsync([node]);
      });
    }

    this.container.classList.add("active-user");
    this.container
      .querySelector("[data-bc-user-show-info]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        const elStatus = this.container.querySelector("[data-bc-user-info]");
        const status = elStatus.getAttribute("data-status");
        if (status == "close") {
          elStatus.setAttribute("data-status", "open");
        } else {
          elStatus.setAttribute("data-status", "close");
        }
      });

    this.container
      .querySelector("[data-bc-user-change-level]")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.signalToDisplayMenu();
        LocalStorageUtil.resetCurrentUserId();
        this.container.classList.add("active-user");
        this.container
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-business")
          ?.classList.remove("active-business");
        this.container
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-corporate")
          ?.classList.remove("active-corporate");

        if (this.deviceId == 2) {
          this.container
            .closest("[data-bc-bp-header-levels-container]")
            .setAttribute("data-active", "user");
          this.container
            .closest("[data-bc-bp-header-levels]")
            .classList.remove("active");
        }
      });
    if (this.options.store.existence == false) {
      const store = this.container.querySelector("[data-bc-store-wrapper]");
      store.remove();
    }
    return Promise.resolve();
  }

  public async loadDataAsync(): Promise<void> {
    const urlFormatter = new Function(
      "rKey",
      `return \`${this.options.dataUrl.profile}\``
    );

    const questions = await HttpUtil.checkRkeyFetchDataAsync<
      Array<IQuestionItem>
    >(urlFormatter(this.options.rKey), "GET", this.options.checkRkey);

    this.profile = QuestionUtil.toObject(questions);
    this.refreshUI();
    this.owner.setSource(DefaultSource.USER_INFO_SOURCE, this.profile);
    //This methode must call if no local storage setting exists
    this.signalToDisplayMenu();
  }

  private signalToDisplayMenu() {
    if (this.profile) {
      const menuInfo: IMenuLoaderParam = {
        owner: "profile",
        pageId: "default",
        ownerId: "",
        ownerUrl: this.options.baseUrl.profile,
        rKey: this.options.rKey,
        menuMethod: this.options.method.menu,
      };
      console.log("qam show profile menu", menuInfo);
      this.owner.setSource(DefaultSource.SHOW_MENU, menuInfo);
      const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
      activeMenus.forEach((e) => {
        e.removeAttribute("data-bc-menu-active");
      });
    }
  }

  private refreshUI() {
    const ui = this.container.querySelector<HTMLDivElement>(
      "[data-bc-user-name]"
    );

    if (ui) {
      if (this.profile.fName != undefined || this.profile.lName != undefined) {
        ui.textContent = `${this.profile.fName ?? ""} ${
          this.profile.lName ?? ""
        }`;
      } else {
        ui.textContent = this.options.method.userNoName;
      }
    }

    const fn = new Function(
      "rKey",
      "profile",
      `return \`${`${this.options.avatar}${this.options.method.userImage}`}\``
    );

    this.container.querySelector<HTMLImageElement>("[data-bc-user-image]").src =
      fn(this.options.rKey, this.profile);

    let i = 0;
    this.container
      .querySelector<HTMLImageElement>("[data-bc-user-image]")
      .addEventListener("error", (e) => {
        if (i == 0) {
          (e.target as HTMLImageElement).src = this.options.method.userNoImage;
          i++;
        }
      });
  }
}
