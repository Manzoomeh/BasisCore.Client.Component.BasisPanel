import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";

export default class LogoutComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-logout-container");
  }

  public initializeAsync(): Promise<void> {
    this.container
      ?.addEventListener("click", async (e) => {
        e.preventDefault();
        const url = HttpUtil.formatString(this.options.logout.url, {
          rKey: this.options.rKey,
        });
        const result = await HttpUtil.sendFormData<IResponseLogout>(
          url,
          "POST",
          `dmntoken=${this.options.logout.dmnToken}`
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
    return true;
  }
}

interface IResponseLogout {
  message: string;
  errorid: number;
  redirectUrl?: string;
}
