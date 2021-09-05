import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./assets/layout.html";
import "./assets/style.css";
import { DefaultSource } from "../../type-alias";
import MenuCache from "./MenuCache";
import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuComponent extends BasisPanelChildComponent {
  readonly ul: HTMLUListElement;
  private cache: MenuCache;
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-menu-container");
    this.ul = this.container.querySelector("[data-bc-menu]");
    this.cache = new MenuCache();
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.SHOW_MENU]);
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      console.log(source.rows);
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    this.ul.innerHTML = "";
    const menuData = await this.cache.loadMenuAsync(menuParam);
    this.ul.append(...menuData);
  }
}
