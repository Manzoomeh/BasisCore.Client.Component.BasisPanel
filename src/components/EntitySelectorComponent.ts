import { BCWrapperFactory, ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../HttpUtil";
import { DefaultSource, PanelLevels } from "../type-alias";
import BasisPanelChildComponent from "./BasisPanelChildComponent";
import { IMenuLoaderParam } from "./menu/IMenuInfo";
import { DependencyContainer } from "tsyringe";
import LocalStorageUtil from "../LocalStorageUtil";
import IProfileAccessor from "./profile/IProfileAccessor";

declare const $bc: BCWrapperFactory;
export default abstract class EntitySelectorComponent extends BasisPanelChildComponent {
  protected profileAccessor: IProfileAccessor;
  protected element: Element;
  protected entityList: Array<IEntityInfo>;
  private _isFirst = true;
  protected mustReload = true;
  // private currentOwnerid: number = 0;
  // private currentDomianid: number = 0;
  // private ownerId: number = 0;
  // private domainId: number = 0;
  // private firstLoginFromOtherWebSitesService = false;
  // private firstLoginFromOtherWebSitesBusiness = false;

  public businessComponentFlag: boolean = false;
  constructor(
    owner: IUserDefineComponent,
    desktopLayout: string,
    mobileLayout: string,
    level: PanelLevels
  ) {
    super(owner, desktopLayout, mobileLayout, `data-bc-bp-${level}-container`);
    this.owner.dc
      .resolve<DependencyContainer>("parent.dc")
      .registerInstance(this.getLevel(), this);
  }

  protected abstract getListUrl(): string;

  protected abstract getLevelUrl(): string;

  protected abstract getSourceId(): string;
  protected abstract getLevel(): PanelLevels;
  protected abstract initLIElement(li: HTMLLIElement, data: IEntityInfo): void;
  public selectService(el: HTMLElement) {
    const msgElId = el.getAttribute("data-id");
    const id = parseInt(msgElId);
    //console.log("qam select service", id);
    if (id != 0) {
      this.setActive();
      this.signalToDisplayMenu(id, false);
    }
  }
  public async initializeAsync(): Promise<void> {
    this.profileAccessor = this.owner.dc
      .resolve<DependencyContainer>("parent.dc")
      .resolve<IProfileAccessor>("ProfileAccessor");

    const checkkrkeyInfo = await this.getCurrentService();
    // this.currentOwnerid = checkkrkeyInfo["currentOwnerid"];
    // this.currentDomianid = checkkrkeyInfo["currentDmnid"];
    // this.domainId = checkkrkeyInfo["dmnid"];
    // this.ownerId = checkkrkeyInfo["ownerid"];
    this.element = this.container.querySelector<Element>("[data-bc-main-list]");
    // const elClick = this.element.closest("[data-bc-main-list-container]").querySelector("[data-bc-main-list-click]");
    const elClicks = this.element
      .closest("[data-bc-main-list-container]")
      .querySelectorAll("[data-bc-drop-down-click]");

    elClicks.forEach((elClick) => {
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
    });

    const msgElClick = this.element
      .closest("[data-bc-main-list-container]")
      .querySelector("[data-bc-main-list-msg-selective]") as HTMLElement;
    msgElClick?.addEventListener("click", async (e) => {
      //console.log("qam dropdown click");
      this.selectService(msgElClick);
    });

    this.owner.addTrigger([DefaultSource.USER_INFO_SOURCE]);
    return Promise.resolve();
  }

  protected async trySelectFromLocalStorageAsync(): Promise<void> {
    if (this._isFirst) {
      this._isFirst = false;
      if (this.mustReload) {
        this.mustReload = false;
        await this.fillComboAsync();
      }
      const id = LocalStorageUtil.getLevelValue(this.getLevel());
      if (id) {
        const relatedElement = this.element.querySelector<HTMLElement>(
          `[data-id='${id}']`
        );
        //console.log(`qam ${this.getLevel()} default`, id, relatedElement);
        if (relatedElement) {
          relatedElement.click();
        }
      } else {
        //console.log(`qam ${this.getLevel()}`, "empty");
      }
    }
  }

  public async runAsync(source?: ISource) {
    switch (source?.id) {
      case DefaultSource.USER_INFO_SOURCE: {
        if (this.getLevel() == "corporate") {
          const corporateList = await this.getEntitiesAsync();

          if (corporateList.length > 0) {
            if (this.deviceId == 1) {
              const corporateElement = this.element
                .closest("[data-bc-bp-main-header]")
                .querySelector("[data-bc-corporate-list]") as HTMLElement;
              corporateElement.style.transform = "scaleY(1)";
            }
          } else {
            let serviceListMobile = document.querySelector(
              "[data-bc-corporate-list]"
            ) as HTMLElement;
            if (serviceListMobile) {
              serviceListMobile.style.display = "none";
            }
            let businessListMobile = document.querySelector(
              "[data-bc-bp-business-container]"
            ) as HTMLElement;
            if (businessListMobile) {
              businessListMobile.style.display = "none";
            }
            const parentElement = this.element.closest(
              "[data-bc-bp-corporate-container]"
            );
            const buyService = document.createElement("div");
            buyService.innerHTML = `<div data-bc-corporate-buy="">
            <a href="${this.options.serviceLink}" target="_blank">
              <span>${this.labels.corporateBuy}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#004B85"/>
              </svg>
              </a>
            </div>`;
            parentElement.prepend(buyService);
            if (this.deviceId == 1) {
              const buyServiceElement = buyService.querySelector(
                "[data-bc-corporate-buy]"
              ) as HTMLElement;
              setTimeout(function () {
                buyServiceElement.style.transform = "scaleY(1)";
              }, 100);
            }
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
    return HttpUtil.checkRkeyFetchDataAsync<Array<IEntityInfo>>(
      url,
      "GET",
      this.options.checkRkey
    );
  }

  filterItems(input, list) {
    let filterList = list.filter(function (e) {
      return (
        e.title.toLowerCase().includes(input.toLowerCase()) || e.id == input
      );
    });
    return filterList;
  }

  protected async fillComboAsync() {
    const businessMsgElement = this.element
      .closest("[data-bc-bp-main-header]")
      .querySelector("[data-bc-business-list]") as HTMLElement;
    this.entityList = await this.getEntitiesAsync();

    if (this.deviceId == 1) {
      if (this.businessComponentFlag == true && this.entityList.length > 0) {
        businessMsgElement.style.transform = "scaleY(1)";
      } else if (
        this.businessComponentFlag == true &&
        this.entityList.length == 0
      ) {
        businessMsgElement.style.transform = "scaleY(0)";
      }
    }

    this.clearCombo();
    const searchWrapper = document.createElement("div");
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    if (this.entityList?.length > 5) {
      if (this.getLevel() == "corporate") {
        searchWrapper.setAttribute("data-bc-corporate-search", "");
        searchInput.setAttribute("data-bc-corporate-search-input", "");
        searchInput.setAttribute(
          "placeHolder",
          this.labels.corporateSearchPlaceholder
        );
        searchWrapper.appendChild(searchInput);

        if (this.deviceId == 2) {
          searchInput.setAttribute("data-sys-input-text-secondary", "");
          const searchButton = document.createElement("div");
          searchButton.setAttribute("data-bc-corporate-search-button", "");
          searchButton.setAttribute("data-sys-plus", "");
          searchButton.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-sys-plus-icon="" fill-rule="evenodd" clip-rule="evenodd" d="M10.5285 2.18931C5.92614 2.18931 2.19517 5.92028 2.19517 10.5226C2.19517 15.125 5.92614 18.856 10.5285 18.856C15.1309 18.856 18.8618 15.125 18.8618 10.5226C18.8618 5.92028 15.1309 2.18931 10.5285 2.18931ZM0.766602 10.5226C0.766602 5.1313 5.13716 0.760742 10.5285 0.760742C15.9199 0.760742 20.2904 5.1313 20.2904 10.5226C20.2904 12.9612 19.3963 15.191 17.9179 16.9019L21.0336 20.0176C21.3125 20.2965 21.3125 20.7488 21.0336 21.0277C20.7546 21.3067 20.3024 21.3067 20.0234 21.0277L16.9078 17.912C15.1968 19.3904 12.9671 20.2846 10.5285 20.2846C5.13716 20.2846 0.766602 15.914 0.766602 10.5226Z" fill="#004B85"/></svg>`;
          searchWrapper.appendChild(searchButton);
        } else {
          searchInput.setAttribute("data-sys-input-text", "");
        }
      } else if (this.getLevel() == "business") {
        searchWrapper.setAttribute("data-bc-business-search", "");
        searchInput.setAttribute("data-bc-business-search-input", "");
        searchInput.setAttribute(
          "placeHolder",
          this.labels.businessSearchPlaceholder
        );
        searchWrapper.appendChild(searchInput);

        if (this.deviceId == 2) {
          searchInput.setAttribute("data-sys-input-text-secondary", "");
          const searchButton = document.createElement("div");
          searchButton.setAttribute("data-bc-business-search-button", "");
          searchButton.setAttribute("data-sys-plus", "");
          searchButton.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-sys-plus-icon="" fill-rule="evenodd" clip-rule="evenodd" d="M10.5285 2.18931C5.92614 2.18931 2.19517 5.92028 2.19517 10.5226C2.19517 15.125 5.92614 18.856 10.5285 18.856C15.1309 18.856 18.8618 15.125 18.8618 10.5226C18.8618 5.92028 15.1309 2.18931 10.5285 2.18931ZM0.766602 10.5226C0.766602 5.1313 5.13716 0.760742 10.5285 0.760742C15.9199 0.760742 20.2904 5.1313 20.2904 10.5226C20.2904 12.9612 19.3963 15.191 17.9179 16.9019L21.0336 20.0176C21.3125 20.2965 21.3125 20.7488 21.0336 21.0277C20.7546 21.3067 20.3024 21.3067 20.0234 21.0277L16.9078 17.912C15.1968 19.3904 12.9671 20.2846 10.5285 20.2846C5.13716 20.2846 0.766602 15.914 0.766602 10.5226Z" fill="#004B85"/></svg>`;
          searchWrapper.appendChild(searchButton);
        } else {
          searchInput.setAttribute("data-sys-input-text", "");
        }
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

  protected async onItemSelectAsync(id: number, fromUI: boolean) {
    //console.log("qam ssss", this.getLevel());
    await this.setActiveAsync(id);
    if (fromUI || LocalStorageUtil.level == this.getLevel()) {
      this.signalToDisplayMenu(id, !fromUI);
    }
  }

  protected entryListMaker(list: IEntityInfo[]) {
    this.element.innerHTML = "";
    list.forEach(async (item) => {
      let businessListMobile = document.querySelector(
        "[data-bc-d2-business-list-wrapper]"
      ) as HTMLElement;
      if (businessListMobile) {
        businessListMobile.style.display = "block";
      }

      const li = document.createElement("li");
      li.setAttribute("data-id", item.id.toString());
      li.innerHTML = `<div data-bc-main-title="">${item.title} (${item.id})</div>`;
      const id = parseInt(li.getAttribute("data-id"));
      this.initLIElement(li, item);
      li.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = parseInt(li.getAttribute("data-id"));

        const entity = this.entityList.find((x) => x.id == id);
        if (this.profileAccessor.getCurrent()) {
          if (entity) {
            await this.onItemSelectAsync(id, e.isTrusted);
          }
        }

        this.owner.setSource(this.getSourceId(), entity ?? {});
        if (this.getLevel() == "corporate") {
          // choose corporate
          this.resetBusinessEntity();
          this.resetNotification();
        } else if (this.getLevel() == "business") {
          $bc.setSource(
            "basispanelcomponent_entityselectorcomponent.businessid",
            id
          );
        }
        //console.log("qam dropdown item click", this.getLevel(), e);
        this.setActive();
        this.selectItem(li);
      });
      this.element.appendChild(li);
    });
  }

  protected async setActiveAsync(id: number) {
    const url = HttpUtil.formatString(this.options.baseUrl.active, {
      rKey: this.options.rKey,
    });
    await HttpUtil.checkRkeyFetchDataAsync(
      url,
      "POST",
      this.options.checkRkey,
      {
        type: this.getLevel(),
        id: id,
      }
    );
    if (this.deviceId == 2) {
      this.element
        .closest("[data-bc-bp-header-levels]")
        .classList.remove("active");
    }
  }

  setActive() {
    if (this.deviceId == 2) {
      this.element
        .closest("[data-bc-bp-main-header]")
        .querySelector(".active-user")
        ?.classList.remove("active-user");
      if (this.getLevel() == "corporate") {
        // choose corporate
        this.element
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-business")
          ?.classList.remove("active-business");
        this.element
          .closest("[data-bc-bp-corporate-container]")
          .classList.add("active-corporate");
        this.element
          .closest("[data-bc-bp-header-levels-container]")
          .setAttribute("data-active", "corporate");
      } else if (this.getLevel() == "business") {
        // choose business
        this.element
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-corporate")
          ?.classList.remove("active-corporate");
        this.element
          .closest("[data-bc-bp-business-container]")
          .classList.add("active-business");
        this.element
          .closest("[data-bc-bp-header-levels-container]")
          .setAttribute("data-active", "business");
      }
      this.element
        .closest("[data-bc-bp-header-levels]")
        .classList.remove("active");
    } else {
      if (this.getLevel() == "corporate") {
        // choose corporate
        this.element
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-business")
          ?.classList.remove("active-business");
        this.element
          .closest("[data-bc-main-list-container]")
          .classList.add("active-corporate");
      } else if (this.getLevel() == "business") {
        // choose business
        this.element
          .closest("[data-bc-bp-main-header]")
          .querySelector(".active-corporate")
          ?.classList.remove("active-corporate");
        this.element
          .closest("[data-bc-main-list-container]")
          .classList.add("active-business");
      }
    }
  }

  InitializeSetActive() {
    if (this.getLevel() == "corporate") {
      // choose corporate
      this.element
        .closest("[data-bc-bp-main-header]")
        .querySelector(".active-business")
        ?.classList.remove("active-business");
      this.element
        .closest("[data-bc-main-list-container]")
        .classList.add("active-corporate");
    } else if (this.getLevel() == "business") {
      // choose business
      this.element
        .closest("[data-bc-bp-main-header]")
        .querySelector(".active-corporate")
        ?.classList.remove("active-corporate");
      this.element
        .closest("[data-bc-main-list-container]")
        .classList.add("active-business");
    }
  }

  protected resetBusinessEntity() {
    $bc.setSource("basispanelcomponent_entityselectorcomponent.businessid", 0);

    const header = this.element.closest("[data-bc-bp-main-header]");
    const businessMsgElement = header.querySelector("[data-bc-business-msg]");
    businessMsgElement.textContent = this.labels.businessTitle;
    businessMsgElement.setAttribute("data-id", "0");
    businessMsgElement.removeAttribute("data-bc-main-list-msg-select");
    header.querySelector("#ctaForBusinessBuy")?.remove();
    header
      .querySelector("[data-bc-bp-business-container] [data-bc-main-name]")
      ?.remove();
    // header.innerHTML = ""
  }

  protected resetNotification() {
    this.owner.setSource("notification.websocket", {
      type: "reset",
      usedforid: "",
    });
  }

  private async getCurrentService() {
    const result = await LocalStorageUtil.checkRkeyResult;
    return result;
  }
  protected selectItem(li: HTMLElement, freeze: boolean = false) {
    const entityElement = this.element
      .closest("[data-bc-main-list-container]")
      .querySelector("[data-bc-main-name]");
    if (entityElement) {
      entityElement.remove();
    }

    const containerMsgElement = this.element
      .closest("[data-bc-main-list-container]")
      .querySelector("[data-bc-main-list-msg]");

    const entityName = document.createElement("div");
    entityName.setAttribute("data-bc-main-name", "");

    if (!freeze) {
      // fill ", this.getLevel(), freeze, li.textContent);
      entityName.textContent = li.textContent;
    } else {
      const entityElement = this.element
      .closest("[data-bc-bp-business-container]")
      const switchInput = document.createElement("input");
      switchInput.setAttribute("type", "checkbox");
      switchInput.setAttribute("id", "switch");
      switchInput.setAttribute("data-bc-business-freeze-input", "");
      switchInput.setAttribute("checked", "checked");
      switchInput.addEventListener("change", async (e) => {
        const checked = switchInput.checked;
        if (!checked) {
          this.resetBusinessEntity();
        }
      });
      // entityName.appendChild(switchInput);
      const switchLabel = document.createElement("label");
      switchLabel.setAttribute("for", "switch");
      switchLabel.setAttribute("data-bc-business-freeze-label", "");
      switchLabel.innerHTML = `<span data-bc-business-freeze-switch=""><svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.18581 2.63636H4.8449V1.95455C4.8449 1.01364 4.08127 0.25 3.14036 0.25C2.19945 0.25 1.43581 1.01364 1.43581 1.95455V2.63636H1.0949C0.719904 2.63636 0.413086 2.94318 0.413086 3.31818V6.72727C0.413086 7.10227 0.719904 7.40909 1.0949 7.40909H5.18581C5.56081 7.40909 5.86763 7.10227 5.86763 6.72727V3.31818C5.86763 2.94318 5.56081 2.63636 5.18581 2.63636ZM3.14036 5.70455C2.76536 5.70455 2.45854 5.39773 2.45854 5.02273C2.45854 4.64773 2.76536 4.34091 3.14036 4.34091C3.51536 4.34091 3.82218 4.64773 3.82218 5.02273C3.82218 5.39773 3.51536 5.70455 3.14036 5.70455ZM2.11763 2.63636V1.95455C2.11763 1.38864 2.57445 0.931818 3.14036 0.931818C3.70627 0.931818 4.16309 1.38864 4.16309 1.95455V2.63636H2.11763Z" fill="#004B85"/></svg></span>`;
      // entityName.appendChild(switchLabel);
      console.log("???" , entityElement)
      // const lockIconWrapper = entityElement.querySelector("[data-bc-bp-business-container]") as HTMLElement

      // lockIcon.querySelector("path").style.fill = "#004B85"
      const lockIcon = document.createElement("div")
      lockIcon.setAttribute("data-bc-link-business-corporate","")
      lockIcon.innerHTML = `
    
<svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8H4C2.88889 8 1.94444 7.61111 1.16667 6.83333C0.388889 6.05556 1.78814e-07 5.11111 1.78814e-07 4C1.78814e-07 2.88889 0.388889 1.94444 1.16667 1.16667C1.94444 0.388888 2.88889 -9.53674e-07 4 -9.53674e-07H7V1.5H4C3.30556 1.5 2.71528 1.74305 2.22917 2.22917C1.74306 2.71528 1.5 3.30556 1.5 4C1.5 4.69444 1.74306 5.28472 2.22917 5.77083C2.71528 6.25694 3.30556 6.5 4 6.5H7V8ZM5 4.75V3.25H11V4.75H5ZM9 8V6.5H12C12.6944 6.5 13.2847 6.25694 13.7708 5.77083C14.2569 5.28472 14.5 4.69444 14.5 4C14.5 3.30556 14.2569 2.71528 13.7708 2.22917C13.2847 1.74305 12.6944 1.5 12 1.5H9V-9.53674e-07H12C13.1111 -9.53674e-07 14.0556 0.388888 14.8333 1.16667C15.6111 1.94444 16 2.88889 16 4C16 5.11111 15.6111 6.05556 14.8333 6.83333C14.0556 7.61111 13.1111 8 12 8H9Z" fill="#004B85"/>
    </svg>
    
`
entityElement.insertBefore(lockIcon, entityElement.firstChild)
      // lockIcon.style.fill = "red"
      
      const title = document.createTextNode(li.textContent);
      entityName.appendChild(title);
    }

    containerMsgElement.parentNode.insertBefore(
      entityName,
      containerMsgElement.nextSibling
    );

    const selectiveList = entityName.closest(
      "[data-bc-main-list-info]"
    ) as HTMLElement;
    containerMsgElement.setAttribute("data-bc-main-list-msg-select", "");
    selectiveList.setAttribute("data-bc-main-list-msg-selective", "");
    selectiveList.setAttribute("data-id", li.getAttribute("data-id"));
    selectiveList.addEventListener("click", (e) => {
      //console.log("qam 1 0");
      this.selectService(selectiveList);
    });

    if (this.deviceId == 2) {
      selectiveList
        .querySelector("[data-bc-main-list-msg]")
        .removeAttribute("data-bc-drop-down-click");
    }

    this.element
      .closest("[data-bc-drop-down-container]")
      .setAttribute("data-status", "close");
  }

  protected clearCombo() {
    this.element.innerHTML = "";
  }

  protected createMenuLoaderParam(id: number): IMenuLoaderParam {
    const menuParam: IMenuLoaderParam = {
      level: this.getLevel(),
      levelId: id,
      levelUrl: this.getLevelUrl(),
    };
    return menuParam;
  }

  private async signalToDisplayMenu(
    id: number,
    setPageDataFromLocalStorage: boolean
  ) {
    // console.log(
    //   `qam ${this.getLevel()} send show menu`,
    //   id,
    //   this._isFirst,
    //   LocalStorageUtil.level,
    //   this.getLevel(),
    //   LocalStorageUtil.level == this.getLevel()
    // );
    LocalStorageUtil.setLevel(this.getLevel(), id);
    const menuParam = this.createMenuLoaderParam(id);
    menuParam.pageId = setPageDataFromLocalStorage
      ? LocalStorageUtil.pageId
      : "default";
    menuParam.moduleId = setPageDataFromLocalStorage
      ? LocalStorageUtil.moduleId
      : 1;
    menuParam.pageArg = setPageDataFromLocalStorage
      ? LocalStorageUtil.pageArguments
      : null;
    this.owner.setSource(DefaultSource.SHOW_MENU, menuParam);
    const activeMenus = document.querySelectorAll("[data-bc-menu-active]");
    activeMenus.forEach((e) => {
      e.removeAttribute("data-bc-menu-active");
    });
  }
}

export interface IEntityInfo {
  id: number;
  title: string;
  erp: boolean;
}
