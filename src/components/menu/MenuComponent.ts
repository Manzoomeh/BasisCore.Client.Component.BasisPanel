import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { SourceId } from "../../basiscore/type-alias";
import HttpUtil from "../../HttpUtil";
import IProfileInfo from "../accounting/IProfileInfo";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./asset/layout.html";
import IMenuInfo from "./IMenuInfo";

export default class MenuComponent extends BasisPanelChildComponent {
  static readonly USER_INFO_SOURCE: SourceId = "basispanel.userinfo";
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-menu-container");
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([MenuComponent.USER_INFO_SOURCE]);
  }

  public async runAsync(source?: ISource) {
    //console.log("MenuComponent", source);
    //iuse
    if (source?.id == MenuComponent.USER_INFO_SOURCE) {
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(profile: IProfileInfo): Promise<void> {
    const formatter = new Function(
      "rKey",
      "profile",
      `return \`${this.options.profileMenuUrl}\``
    );
    const menuItems = await HttpUtil.getDataAsync<IMenuInfo>(
      formatter(this.options.rKey, profile)
    );

    console.log(menuItems);
  }
}
