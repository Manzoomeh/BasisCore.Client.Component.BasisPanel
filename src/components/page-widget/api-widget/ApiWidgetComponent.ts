import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent } from "basiscore";
import { ISource } from "basiscore";
import PageWidgetComponent from "../PageWidgetComponent";
import IPage from "../../page/IPage";
import NotificationMessageComponent from "../../notificationMessage/NotificationMessageComponent";
import WidgetListComponent from "../../widget-list/WidgetListComponent";
import MenuComponent from "../../menu/MenuComponent";
import PageComponent from "../../page/PageComponent";
import WidgetComponent from "../widget/WidgetComponent";

export default class ApiWidgetComponent extends WidgetComponent {
    pageLoader: MenuComponent;
    constructor(owner: IUserDefineComponent) {
        super(owner);
    }


    public async loadContentAsync(): Promise<string> {

        const url = this.param.url
        return await HttpUtil.fetchStringAsync(url, "GET");
    }

}
