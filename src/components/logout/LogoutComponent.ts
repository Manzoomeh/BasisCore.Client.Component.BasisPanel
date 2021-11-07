import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import HttpUtil from "../../HttpUtil";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";

export default class LogoutComponent extends BasisPanelChildComponent {

    constructor(owner : IUserDefineComponent) {
        super(owner, layout, "data-bc-bp-logout-container");
    }

    public initializeAsync(): void | Promise < void > {
        this.container.querySelector("[data-bc-logout-click]").addEventListener("click", async (e) => {
            e.preventDefault();
            const url = HttpUtil.formatString(this.options.logout.url, {rKey: this.options.rKey});
            const result = await HttpUtil.fetchDataAsync<IResponseLogout>(url, "GET");
            window.location.href = result.redirectUrl && result.redirectUrl!="" ? result.redirectUrl : this.options.logout.defaultRedirectUrl ;
        });
    }

    public runAsync(source? : ISource) {
        return true;
    }
}

interface IResponseLogout {
  message: string;
  redirectUrl: string;
}