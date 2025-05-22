import { IDependencyContainer, ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import layout from "./assets/layout.html";
import "./assets/style.css";
import HttpUtil from "../../HttpUtil";
import LocalStorageUtil from "../../LocalStorageUtil";
import IPageInfo from "../page/IPageInfo";
import IStateModel from "../menu/IStateModel";

export default class WorkspaceComponent extends BasisPanelChildComponent {
  private pageType: string;
  public info: IPageInfo;
  private _announce = LocalStorageUtil.getLastAnnounce();
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, layout, "data-bc-bp-workspace-container");
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("workspace", this);
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE]);
    return Promise.resolve();
  }
  public async checkAnnounce() {
    if (this.options.bannerUrl) {
      const url = HttpUtil.formatString(
        this.options.baseUrl.profile + this.options.announceURL,
        { rKey: this.options.rKey }
      );
      
      try {
        if (this._announce) {
          if (this.options.rKey == this._announce.rkey) {
            // this.showLastBanners();
          } else {
            const res = await HttpUtil.fetchDataAsync<any>(url, "GET");
           
              LocalStorageUtil.setAnnounce(
                this.options.rKey,
                res.text,
                res.link
              );
              // this.addBannerToPage(res.groups[0]);
            
          }
        } else {
          const res = await HttpUtil.fetchDataAsync<any>(url, "GET");

          LocalStorageUtil.setAnnounce(
            this.options.rKey,
            "click here",
            "link"
          );
          this.addAnnounceToPage(res.text, res.link);
        }
      } catch {}
    }
   
  }
  private addAnnounceToPage(text:string , link: string){
    const announceWrapper = document.createElement("div")
    const announceLinkWrapper = document.createElement("div")
    const announceLink = document.createElement("a")
    const announceText = document.createElement("div")
    const closeAnnounce = document.createElement("div")
    announceWrapper.setAttribute("bc-bp-announce-wrapper","")
    announceLink.setAttribute("href" , link)
    announceLink.setAttribute("target" , "_blank")
    announceLink.setAttribute("data-bc-bp-announceliknk","")
    announceText.setAttribute("data-bc-bp-announcetext","")
    announceLinkWrapper.setAttribute("data-bc-bp-announceliknk-wrapper" , "")
    closeAnnounce.innerHTML=`
<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.8" d="M8.58904 7.99988L14.242 14.2303C14.6099 14.6355 14.6099 15.2908 14.242 15.6961C13.8743 16.1013 13.2798 16.1013 12.9121 15.6961L7.25889 9.46566L1.60589 15.6961C1.238 16.1013 0.643631 16.1013 0.275916 15.6961C-0.0919719 15.2908 -0.0919719 14.6355 0.275916 14.2303L5.92892 7.99988L0.275916 1.76948C-0.0919719 1.36422 -0.0919719 0.708971 0.275916 0.303709C0.459171 0.101553 0.700123 0 0.940904 0C1.18168 0 1.42246 0.101553 1.60589 0.303709L7.25889 6.53411L12.9121 0.303709C13.0955 0.101553 13.3363 0 13.5771 0C13.8178 0 14.0586 0.101553 14.242 0.303709C14.6099 0.708971 14.6099 1.36422 14.242 1.76948L8.58904 7.99988Z" fill="#00A693"/>
</svg>
`
    announceLink.textContent=`اینجا کلیک کنید`
    announceText.innerHTML = `
<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3425 0.449219L12.2625 1.52922L13.8625 3.12922C14.0825 3.37922 14.1925 3.66922 14.1925 3.99922C14.1925 4.32922 14.0825 4.63922 13.8625 4.85922L10.3125 8.46922L11.3125 9.54922L14.9425 5.93922C15.4725 5.34922 15.7325 4.69922 15.7325 3.99922C15.7325 3.29922 15.4725 2.63922 14.9425 2.04922L13.3425 0.449219ZM9.3625 2.46922L8.2825 3.54922L8.8925 4.10922C9.1125 4.32922 9.2225 4.62922 9.2225 4.99922C9.2225 5.36922 9.1125 5.66922 8.8925 5.88922L8.2825 6.44922L9.3625 7.52922L9.9225 6.91922C10.4525 6.32922 10.7225 5.68922 10.7225 4.99922C10.7225 4.27922 10.4525 3.62922 9.9225 3.02922L9.3625 2.46922ZM19.8125 4.05922C19.1225 4.05922 18.4825 4.32922 17.8925 4.85922L12.2625 10.4992L13.3425 11.4992L18.9225 5.93922C19.1725 5.68922 19.4725 5.55922 19.8125 5.55922C20.1525 5.55922 20.4525 5.68922 20.7025 5.93922L21.3125 6.54922L22.3425 5.46922L21.7825 4.85922C21.1925 4.32922 20.5325 4.05922 19.8125 4.05922ZM5.8125 6.99922L0.8125 20.9992L14.8125 15.9992L5.8125 6.99922ZM17.8125 10.0592C17.1125 10.0592 16.4725 10.3292 15.8725 10.8592L14.2825 12.4492L15.3625 13.5292L16.9525 11.9392C17.2025 11.6892 17.4825 11.5592 17.8125 11.5592C18.1425 11.5592 18.4425 11.6892 18.6925 11.9392L20.3125 13.5292L21.3625 12.4992L19.7625 10.8592C19.1725 10.3292 18.5125 10.0592 17.8125 10.0592Z" fill="#00A693"/>
</svg>
 نسخه جدید ماژول حسابداری شروع به کار کرد
 
<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3425 0.449219L12.2625 1.52922L13.8625 3.12922C14.0825 3.37922 14.1925 3.66922 14.1925 3.99922C14.1925 4.32922 14.0825 4.63922 13.8625 4.85922L10.3125 8.46922L11.3125 9.54922L14.9425 5.93922C15.4725 5.34922 15.7325 4.69922 15.7325 3.99922C15.7325 3.29922 15.4725 2.63922 14.9425 2.04922L13.3425 0.449219ZM9.3625 2.46922L8.2825 3.54922L8.8925 4.10922C9.1125 4.32922 9.2225 4.62922 9.2225 4.99922C9.2225 5.36922 9.1125 5.66922 8.8925 5.88922L8.2825 6.44922L9.3625 7.52922L9.9225 6.91922C10.4525 6.32922 10.7225 5.68922 10.7225 4.99922C10.7225 4.27922 10.4525 3.62922 9.9225 3.02922L9.3625 2.46922ZM19.8125 4.05922C19.1225 4.05922 18.4825 4.32922 17.8925 4.85922L12.2625 10.4992L13.3425 11.4992L18.9225 5.93922C19.1725 5.68922 19.4725 5.55922 19.8125 5.55922C20.1525 5.55922 20.4525 5.68922 20.7025 5.93922L21.3125 6.54922L22.3425 5.46922L21.7825 4.85922C21.1925 4.32922 20.5325 4.05922 19.8125 4.05922ZM5.8125 6.99922L0.8125 20.9992L14.8125 15.9992L5.8125 6.99922ZM17.8125 10.0592C17.1125 10.0592 16.4725 10.3292 15.8725 10.8592L14.2825 12.4492L15.3625 13.5292L16.9525 11.9392C17.2025 11.6892 17.4825 11.5592 17.8125 11.5592C18.1425 11.5592 18.4425 11.6892 18.6925 11.9392L20.3125 13.5292L21.3625 12.4992L19.7625 10.8592C19.1725 10.3292 18.5125 10.0592 17.8125 10.0592Z" fill="#00A693"/>
</svg>

 `  
    closeAnnounce.addEventListener("click" , function(){
      announceWrapper.setAttribute("bc-bp-announce-wrapper-hide","")
    })
    announceLinkWrapper.appendChild(announceLink)
    announceLinkWrapper.appendChild(closeAnnounce)
    announceWrapper.appendChild(announceLinkWrapper)
    announceWrapper.appendChild(announceText)
    document.querySelector("body").appendChild(announceWrapper)
    
  }
  public async runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      await this.checkAnnounce()
      let pageParam: IPageLoaderParam = source.rows[0] as IPageLoaderParam;
      // if (LocalStorageUtil.hasPageToShow()) {
      //   if (LocalStorageUtil.mustLoadPage(pageParam.level)) {
      //     const temp = LocalStorageUtil.getCurrentPage();
      //     if (temp) {
      //       //temp.rKey = this.options.rKey;
      //       pageParam = temp;
      //     }
      //   } else {
      //     pageParam = null;
      //   }
      // }
      if (pageParam) {
        //LocalStorageUtil.setCurrentPage(pageParam);
        LocalStorageUtil.setPage(
          pageParam.moduleId,
          pageParam.pageId,
          pageParam.dashboard,
          pageParam.arguments
        );
        const url = HttpUtil.formatString(
          `${pageParam.moduleUrl}${this.options.method.page}`,
          pageParam
        );
        this.info = await HttpUtil.checkRkeyFetchDataAsync<IPageInfo>(
          url,
          "GET",
          this.options.checkRkey
        );
        this.pageType = this.info?.container;

        await this.displayPageAsync(pageParam);
      }
    }
    return true;
  }

  private async displayPageAsync(
    pageLoaderParam: IPageLoaderParam
  ): Promise<void> {
    const param = JSON.stringify(pageLoaderParam);
    if (!pageLoaderParam.isSilent) {
      const model: IStateModel = {
        corporateId: LocalStorageUtil.corporateId,
        businessId: LocalStorageUtil.businessId,
        level: pageLoaderParam.level,
        levelId: pageLoaderParam.levelId,
        moduleId: pageLoaderParam.moduleId,
        pageId: pageLoaderParam.pageId,
        arguments: pageLoaderParam.arguments,
        menuPageId: LocalStorageUtil.menuPageId,
      };
      history.pushState(
        model,
        "",
        `${this.options.urlPrefix ? this.options.urlPrefix : ""}/${
          pageLoaderParam.level
        }${
          (pageLoaderParam.moduleId ?? 1) != 1
            ? `/${pageLoaderParam.moduleName}`
            : ""
        }/${pageLoaderParam.pageId}`
      );
    }
    const doc = this.owner.toNode(
      `<basis core="group" run="atclient"> <basis core="component.basispanel.${this.pageType}" run="atclient" params='${param}'></basis></basis>`
    );
    const nodes = Array.from(doc.childNodes);
    this.container.innerHTML = "";
    this.container.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }
}
