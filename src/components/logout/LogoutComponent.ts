import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import { IQuestionItem } from "../../type-alias";
import IProfileInfo from "../profile/IProfileInfo";
import { QuestionUtil } from "../../QuestionUtil";

export default class LogoutComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-logout-container");
  }

  public initializeAsync(): Promise<void> {
    if (this.deviceId == 1) {
      this.container.setAttribute("data-sys-hover", "");
    }
    let eventContainer = this.container;
    if (this.deviceId == 2) {
      eventContainer = this.container.querySelector("[data-bc-logout-btn]");

      const logoutIcon = this.container.querySelector("[data-bc-logout-icon]");
      logoutIcon?.addEventListener("click", async (e) => {
        e.preventDefault();
        this.container
          .querySelector("[data-bc-bp-logout]")
          .setAttribute("data-logout-confirm", "true");
      });

      const logoutCancel = this.container.querySelector(
        "[data-bc-logout-cancel]"
      );
      logoutCancel?.addEventListener("click", async (e) => {
        e.preventDefault();
        this.container
          .querySelector("[data-bc-bp-logout]")
          .setAttribute("data-logout-confirm", "");
      });
    } else {
      eventContainer = this.container.querySelector("[data-bc-logout-btn]");
      const logoutPopupContainer = this.container.querySelector(
        "[data-bc-bp-logout-modal]"
      );

      const logout = this.container.querySelector(
        "[data-bc-bp-logout-wrapper]"
      );
      logout?.addEventListener("click", async (e) => {
        e.preventDefault();
        (logoutPopupContainer as HTMLElement).style.display = "block";
      });

      const logoutClosed = this.container.querySelectorAll(
        "[data-bc-bp-logout-modal-closed]"
      );
      logoutClosed.forEach((element) => {
        element.addEventListener("click", async (e) => {
          e.preventDefault();
          (logoutPopupContainer as HTMLElement).style.display = "none";
        });
      });
    }

    eventContainer?.addEventListener("click", async (e) => {
      e.preventDefault();
      const getDmnTokenUrl = HttpUtil.formatString(
        this.options.logout.getDmnTokenUrl,
        {
          rKey: this.options.rKey,
        }
      );
      const dmnToken = await HttpUtil.fetchDataAsync<IResponseDmnToken>(
        getDmnTokenUrl,
        "GET"
      );

      const logoutUrl = HttpUtil.formatString(this.options.logout.url, {
        rKey: this.options.rKey,
      });
      const result = await HttpUtil.sendFormData<IResponseLogout>(
        logoutUrl,
        "POST",
        `dmntoken=${dmnToken.dmnToken}`
      );
      const cookieName = this.options.logout.cookieName;
      if (result.errorid == this.options.logout.successId) {
        if (cookieName && cookieName != "") {
          const cookies = document.cookie.split(";");
          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim().split("=")[0];
            if (cookie == cookieName) {
              document.cookie =
                cookie + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              break;
            }
          }
        }
        window.location.href =
          result.redirectUrl && result.redirectUrl != ""
            ? result.redirectUrl
            : this.options.logout.defaultRedirectUrl;
      }
    });
    return Promise.resolve();
  }

  public runAsync(source?: ISource) {
    return this.loadDataAsync();
  }

  public async loadDataAsync(): Promise<void> {
    if (this.deviceId == 2) {
      const urlFormatter = new Function(
        "rKey",
        `return \`${this.options.dataUrl.profile}\``
      );

      const questions = await HttpUtil.checkRkeyFetchDataAsync<
        Array<IQuestionItem>
      >(urlFormatter(this.options.rKey), "GET", this.options.checkRkey);

      this.profile = QuestionUtil.toObject(questions);
      this.refreshUI();
      // this.owner.setSource(DefaultSource.USER_INFO_SOURCE, this.profile);
      // this.signalToDisplayMenu();
    }
  }

  private refreshUI() {
    const ui = this.container.querySelector<HTMLDivElement>(
      "[data-bc-logout-user-name]"
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

    this.container.querySelector<HTMLImageElement>(
      "[data-bc-logout-user-image]"
    ).src = fn(this.options.rKey, this.profile);

    let i = 0;
    this.container
      .querySelector<HTMLImageElement>("[data-bc-logout-user-image]")
      .addEventListener("error", (e) => {
        if (i == 0) {
          (e.target as HTMLImageElement).src = this.options.method.userNoImage;
          i++;
        }
      });
  }
}

interface IResponseLogout {
  message: string;
  errorid: number;
  redirectUrl?: string;
}

interface IResponseDmnToken {
  dmnToken: string;
}
