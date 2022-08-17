import { ISource, IUserDefineComponent, IDependencyContainer } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import layout from "./assets/layout.html";
import "./assets/style.css";
import { DefaultSource } from "../../type-alias";
import MenuCacheManager from "./MenuCacheManager";
import { IMenuLoaderParam } from "./IMenuInfo";
import MenuElement from "./MenuElement";
import IPageLoaderParam from "./IPageLoaderParam";
import IPageLoader from "./IPageLoader";
import HttpUtil from "../../HttpUtil";

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
    this.cache = new MenuCacheManager(this.options.checkRkey);
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
    
    // for fix menu after scroll
    const menu = this.container;
    const themeContainer = this.container.closest("[data-bc-bp-main-container]").querySelector("[data-bc-bp-theme-container]");
    var sticky = (this.container as HTMLElement).offsetTop;
    window.onscroll = function() {
      if (window.pageYOffset >= sticky) {
        menu.setAttribute("data-bc-bp-sticky", "");
        themeContainer.setAttribute("data-bc-bp-sticky", "");
      } else {
        menu.removeAttribute("data-bc-bp-sticky");
        themeContainer.removeAttribute("data-bc-bp-sticky");
      }
    };
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([
      DefaultSource.SHOW_MENU,
      DefaultSource.BUSINESS_SOURCE,
    ]);
    return Promise.resolve();
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

  private async onMenuItemClick(
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

  public async tryLoadPage(pageId: string, args?: any): Promise<boolean> {
    var source = this.owner.tryToGetSource(DefaultSource.DISPLAY_PAGE);
    if (source) {
        const param = source.rows[0] as IPageLoaderParam;
        const newParam: IPageLoaderParam = {
          pageId: pageId,
          owner: param.owner,
          ownerId: param.ownerId,
          ownerUrl: param.ownerUrl,
          rKey: param.rKey,
          pageMethod: param.pageMethod,
          arguments: args,
        };
        this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
    }
    return source != null;
  }
}
