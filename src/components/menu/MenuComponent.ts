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
    this.cache = new MenuCacheManager();
    //add this to parent container to see in all other components
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("page_loader", this);
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.SHOW_MENU]);
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
    const isAuthenticate = await HttpUtil.isAuthenticate(
      this.options.rKey,
      this.options.checkRkey
    )
    const cookieName = this.options.checkRkey.cookieName;
    if (isAuthenticate == false) {
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
      window.location.href = this.options.checkRkey.defaultRedirectUrl;
    } else {
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
  }

  public async tryLoadPage(pageId: string, args?: any): Promise<boolean> {
    var source = this.owner.tryToGetSource(DefaultSource.DISPLAY_PAGE);
    if (source) {
      const isAuthenticate = await HttpUtil.isAuthenticate(
        this.options.rKey,
        this.options.checkRkey
      )
      const cookieName = this.options.checkRkey.cookieName;
      if (isAuthenticate == false) {
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
        window.location.href = this.options.checkRkey.defaultRedirectUrl;
      } else {
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
    }
    return source != null;
  }
}
