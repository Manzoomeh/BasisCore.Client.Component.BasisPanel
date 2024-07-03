import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent } from "basiscore";
import MenuComponent from "../../menu/MenuComponent";
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
