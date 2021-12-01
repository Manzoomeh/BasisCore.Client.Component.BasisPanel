import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";
import { DefaultSource } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";
import { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import IPageLoaderParam from "./IPageLoaderParam";
import IDependencyContainer from "../../basiscore/IDependencyContainer";

export default class MenuComponent
  extends BasisPanelChildComponent
  implements IPageLoader
{
  readonly ul: HTMLUListElement;
  private cache: MenuCacheManager;
  private current: MenuElement;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-menu-container");
    this.ul = this.container.querySelector("[data-bc-menu]");
    this.cache = new MenuCacheManager();
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
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
    const newMenu = await this.cache.loadMenuAsync(
      menuParam,
      this.onMenuItemClick.bind(this)
    );
    if (this.current != newMenu) {
      this.current = newMenu;
      this.ul.innerHTML = "";
      this.ul.append(...this.current.nodes);
    }
  }

  private onMenuItemClick(
    pageId: string,
    param: IMenuLoaderParam,
    target: EventTarget
  ) {
    const newParam: IPageLoaderParam = {
      pageId: pageId,
      owner: param.owner,
      ownerId: param.ownerId,
      ownerUrl: param.ownerUrl,
      rKey: param.rKey,
      pageMethod: this.options.method.page,
    };
    this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  }

  public tryLoadPage(pageId: string): boolean {
    const retVal = this.current?.pageLookup.has(pageId) ?? false;
    if (retVal) {
      const param = this.current.pageLookup.get(pageId);
      this.onMenuItemClick(pageId, param, null);
    }
    return retVal;
  }
}

interface IPageLoader {
  tryLoadPage(pageId: string): boolean;
}
