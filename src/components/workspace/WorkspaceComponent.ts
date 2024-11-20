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

  public async runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
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
      console.log("qam add", model);
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
