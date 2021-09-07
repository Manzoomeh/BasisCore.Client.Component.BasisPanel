import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import html from "./assets/layout.html";
import "./assets/style.css";
import { DefaultSource } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";
import { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import { menu } from "../../ComponentLoader";

export default class MenuComponent extends BasisPanelChildComponent {
  readonly ul: HTMLUListElement;
  private cache: MenuCacheManager;
  private current: MenuElement;
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-menu-container");
    this.ul = this.container.querySelector("[data-bc-menu]");
    this.cache = new MenuCacheManager();
    this.ul.addEventListener("click", (e) => {
      const pid = (e.target as Element)?.getAttribute("data-bc-pid");
      if (pid) {
        e.preventDefault();
        this.displayPage(parseInt(pid));
      }
    });
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.SHOW_MENU]);
  }

  public async runAsync(source?: ISource) {
    if (source?.id == DefaultSource.SHOW_MENU) {
      await this.loadDataAsync(source.rows[0]);
    }
  }

  public async loadDataAsync(menuParam: IMenuLoaderParam): Promise<void> {
    const newMenu = await this.cache.loadMenuAsync(menuParam);
    if (this.current != newMenu) {
      this.current = newMenu;
      console.log("menu update", menuParam);
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);
    }
  }

  private displayPage(pid: number) {
    console.log(this.current, pid);
  }
}
