import { ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../HttpUtil";
import { DefaultSource, MenuOwnerType } from "../type-alias";
import IProfileInfo from "./profile/IProfileInfo";
import BasisPanelChildComponent from "./BasisPanelChildComponent";
import { IMenuLoaderParam } from "./menu/IMenuInfo";
import IPageLoaderParam from "./menu/IPageLoaderParam";
import { corporate } from "../ComponentLoader";

export default abstract class EntitySelectorComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;
  private element: Element;
  private ownerType: MenuOwnerType;
  private entityList: Array<IEntityInfo>;
  protected mustReload = true;
  public businessComponentFlag: boolean = false;
  constructor(
    owner: IUserDefineComponent,
    layout: string,
    entityType: MenuOwnerType
  ) {
    super(owner, layout, `data-bc-bp-${entityType}-container`);
    this.ownerType = entityType;
    
  
  }

  protected abstract getListUrl(): string;

  protected abstract getOwnerUrl(): string;

  protected abstract getSourceId(): string;

  public initializeAsync(): Promise<void> {
    this.element = this.container.querySelector<Element>("[data-bc-main-list]");
    // const elClick = this.element.closest("[data-bc-main-list-container]").querySelector("[data-bc-main-list-click]");
    const elClick = this.element
      .closest("[data-bc-main-list-container]")
      .querySelector("[data-bc-drop-down-click]");
    elClick.addEventListener("click", async (e) => {
      if (this.mustReload) {
        this.mustReload = false;
        await this.fillComboAsync();
       
      } 
      const elStatus = this.element.closest("[data-bc-drop-down-container]");
      const status = elStatus.getAttribute("data-status");      
      if (status == "close") {
        elStatus.setAttribute("data-status", "open");
      } else {
        elStatus.setAttribute("data-status", "close");
      }       
         
        
    });

    const msgElClick = this.element
      .closest("[data-bc-main-list-container]")
      .querySelector("[data-bc-main-list-msg]");
    msgElClick.addEventListener("click", async (e) => {
  
      const msgElId = msgElClick.getAttribute("data-id");
      if (msgElId != "0") {
        this.owner.setSource(
          DefaultSource.SHOW_MENU,
          this.createMenuLoaderParam(parseInt(msgElId))
        );
        this.signalToDisplayPage(parseInt(msgElId));
      }
      
    });
    
    this.owner.addTrigger([DefaultSource.USER_INFO_SOURCE]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    switch (source?.id) {
      case DefaultSource.USER_INFO_SOURCE: {
        this.profile = source.rows[0];
        if (this.ownerType == "corporate") {
          const corporateList = await this.getEntitiesAsync();

          if (corporateList.length > 0) {
            const corporateElement = this.element
              .closest("[data-bc-bp-main-header]")
              .querySelector("[data-bc-corporate-list]") as HTMLElement;
            corporateElement.style.transform = "scaleY(1)";
          } else {
            const parentElement = this.element.closest(
              "[data-bc-bp-corporate-container]"
            );
            const buyService = document.createElement("div");
            buyService.innerHTML = `<div data-bc-corporate-buy="">
            <span>خرید سرویس</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#004B85"/>
                </svg>
                
        </div>`;
            parentElement.prepend(buyService);
            const buyServiceElement = buyService.querySelector(
              "[data-bc-corporate-buy]"
            ) as HTMLElement;
            setTimeout(function () {
              buyServiceElement.style.transform = "scaleY(1)";
            }, 100);
          }
        }
        break;
      }
    }
    return true;
  }

  protected getEntitiesAsync(): Promise<Array<IEntityInfo>> {
    const url = HttpUtil.formatString(this.getListUrl(), {
      rKey: this.options.rKey,
    });
    return HttpUtil.fetchDataAsync<Array<IEntityInfo>>(url, "GET");
  }

  filterItems(input, list) {
    let filterList = list.filter(function (e) {
      return e.title.toLowerCase().includes(input.toLowerCase());
    });
    return filterList;
  }

  protected async fillComboAsync() {
    const businessMsgElement = this.element
      .closest("[data-bc-bp-main-header]")
      .querySelector("[data-bc-business-list]") as HTMLElement;
    this.entityList = await this.getEntitiesAsync();

    if (this.businessComponentFlag == true && this.entityList.length > 0) {
      businessMsgElement.style.transform = "scaleY(1)";
    } else if (
      this.businessComponentFlag == true &&
      this.entityList.length == 0
    ) {
      businessMsgElement.style.transform = "scaleY(0)";
    }

    this.clearCombo();
    const searchWrapper = document.createElement("div");
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    if (this.entityList?.length > 5) {
      if (this.ownerType == "corporate") {
        searchWrapper.setAttribute("data-bc-corporate-search", "");
        searchInput.setAttribute("placeHolder", "جستجوی شرکت ...");
        searchWrapper.appendChild(searchInput);
      } else if (this.ownerType == "business") {
        searchWrapper.setAttribute("data-bc-business-search", "");
        searchInput.setAttribute("placeHolder", "جستجوی شرکت");
        searchWrapper.appendChild(searchInput);
      }
    }
    let listFilter = this.entityList;
    searchInput.addEventListener("keyup", (e) => {
      listFilter = [];
      if (e.target["value"] == "") {
        listFilter = this.entityList;
      }
      listFilter = this.filterItems(e.target["value"], this.entityList);
      this.entryListMaker(listFilter);
    });
    this.entryListMaker(listFilter);
    this.element.previousSibling.remove();
    this.element.parentNode.insertBefore(searchWrapper, this.element);
  }

  entryListMaker(list) {
    this.element.innerHTML = "";
    if (list?.length > 0) {
      list.forEach((item) => {
        const li = document.createElement("li");
        // const div = document.createElement("div");
        li.setAttribute("data-id", item.id.toString());
        li.addEventListener("click", async (e) => {
          e.preventDefault();
          // const id = parseInt(this.element.value);
          const id = parseInt(li.getAttribute("data-id"));
          const entity = this.entityList.find((x) => x.id == id);

          if (this.profile) {
            if (entity) {
              const url = HttpUtil.formatString(this.options.baseUrl.active, {
                rKey: this.options.rKey,
              });
              await HttpUtil.fetchDataAsync(url, "POST", {
                type: this.ownerType,
                id: id,
              });
              this.owner.setSource(
                DefaultSource.SHOW_MENU,
                this.createMenuLoaderParam(id)
              );
              this.signalToDisplayPage(id);
            }
          }
          if(this.ownerType == "corporate"){
            this.element.closest("[data-bc-main-list-container]").classList.add("active-corporate")
           }
           else if(this.ownerType == "business"){
             this.element.closest("[data-bc-bp-main-header]").querySelector(".active-corporate").classList.remove("active-corporate")
            this.element.closest("[data-bc-main-list-container]").classList.add("active-busuness")
           }
          this.owner.setSource(this.getSourceId(), entity ?? {});
          if (this.ownerType == "corporate") {
            const businessMsgElement = this.element
              .closest("[data-bc-bp-main-header]")
              .querySelector("[data-bc-business-msg]");
            businessMsgElement.textContent = "کسب‌و‌کارها";
            businessMsgElement.setAttribute("data-id", "0");
            (businessMsgElement as HTMLElement).style.cursor = "auto";
          }
          const existCorporateElemant = this.element
            .closest("[data-bc-main-list-container]")
            .querySelector("[data-bc-corporate-name]");
          if (existCorporateElemant) {
            existCorporateElemant.remove();
          }
          const containerMsgElement = this.element
            .closest("[data-bc-main-list-container]")
            .querySelector("[data-bc-main-list-msg]");
          const CorporateName = document.createElement("div");
          CorporateName.textContent = li.textContent;
          const elClick = this.element
            .closest("[data-bc-main-list-container]")
            .querySelector("[data-bc-drop-down-click]") as HTMLElement;
          elClick.style.top = "-5px";
          CorporateName.setAttribute("data-bc-corporate-name", "");
          containerMsgElement.parentNode.insertBefore(
            CorporateName,
            containerMsgElement.nextSibling
          );
          containerMsgElement.setAttribute("data-bc-main-list-msg-select", "");
          containerMsgElement.setAttribute(
            "data-id",
            li.getAttribute("data-id")
          );
          (containerMsgElement as HTMLElement).style.cursor = "pointer";
          this.element
            .closest("[data-bc-drop-down-container]")
            .setAttribute("data-status", "close");
        });
        // div.textContent = item.title;
        // li.appendChild(div);
        li.textContent = item.title;
        this.element.appendChild(li);
      });
    }
  }

  protected clearCombo() {
    this.element.innerHTML = "";
  }

  protected createMenuLoaderParam(id: Number): IMenuLoaderParam {
    
    const menuParam: IMenuLoaderParam = {
      owner: this.ownerType,
      // ownerId: this.element.value,
      ownerId: id.toString(),
      ownerUrl: this.getOwnerUrl(),
      rKey: this.options.rKey,
      menuMethod: this.options.method.menu,
    };
    return menuParam;
  }

  private async signalToDisplayPage(id: Number) {
    const activeMenus = document.querySelectorAll("[data-bc-menu-active]")
    activeMenus.forEach(e => {
      e.removeAttribute("data-bc-menu-active")
    })
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
        pageId: "default",
        owner: this.ownerType,
        ownerId: id.toString(),
        ownerUrl: this.getOwnerUrl(),
        rKey: this.options.rKey,
        pageMethod: this.options.method.page,
      };    
      this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
    }
    

  }
}

export interface IEntityInfo {
  id: number;
  title: string;
}
