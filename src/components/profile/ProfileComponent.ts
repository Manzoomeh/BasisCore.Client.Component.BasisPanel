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
import LocalStorageUtil from "../../LocalStorageUtil";
import IProfileAccessor from "./IProfileAccessor";
import IStateModel from "../menu/IStateModel";

export default class ProfileComponent
  extends BasisPanelChildComponent
  implements IProfileAccessor
{
  private profile: IProfileInfo;
  private isFirst: boolean = true;

  public getCurrent(): IProfileInfo {
    return this.profile;
  }
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-profile-container");
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .resolve<IDependencyContainer>("parent.dc")
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("profile_accessor", this);
  }

  public runAsync(source?: ISource): Promise<any> {
    if (source?.id == DefaultSource.SET_STATE) {
      const state = source.rows[0] as IStateModel;
      if (state.level == "profile") {
        this.signalToDisplayMenu(true, true);
      }
    } else {
      if (this.isFirst) {
        return this.loadDataAsync();
      }
    }
  }

  public initializeAsync(): Promise<void> {
    const nodes = this.container.querySelectorAll("basis");
    this.owner.addTrigger([DefaultSource.SET_STATE]);
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
        this.signalToDisplayMenu(false, false);
        LocalStorageUtil.setLevel("profile", 1);
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
    // if (this.options.store.existence == false) {
    //   const store = this.container.querySelector("[data-bc-store-wrapper]");
    //   store.remove();
    // }
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
    if (LocalStorageUtil.level === "profile") {
      this.signalToDisplayMenu(true, false);
    }
  }

  private signalToDisplayMenu(
    loadPageFromLocalStorage: boolean,
    isSilent: boolean
  ) {
    if (this.profile) {
      const menuInfo: IMenuLoaderParam = {
        level: "profile",
        levelId: 1,
        levelUrl: this.options.baseUrl.profile,
        moduleId: 1,
        isSilent: isSilent,
        pageId: loadPageFromLocalStorage ? LocalStorageUtil.pageId : "default",
        pageArg: loadPageFromLocalStorage
          ? LocalStorageUtil.pageArguments
          : null,
      };
      this.owner.setSource(DefaultSource.SHOW_MENU, menuInfo);
      const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
      activeMenus.forEach((e) => {
        e.removeAttribute("data-bc-menu-active");
      });
    }
    this.isFirst = false;
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
