import { IDependencyContainer, ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import layout from "./assets/layout.html";
import "./assets/style.css";
import HttpUtil from "../../HttpUtil";
import LocalStorageUtil from "../../LocalStorageUtil";
import IPageInfo from "../page/IPageInfo";
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
      if (LocalStorageUtil.hasPageToShow()) {
        if (LocalStorageUtil.mustLoadPage(pageParam.owner)) {
          const temp = LocalStorageUtil.getCurrentPage();
          if (temp) {
            temp.rKey = this.options.rKey;
            pageParam = temp;
          }
        } else {
          pageParam = null;
        }
      }
      if (pageParam) {
        LocalStorageUtil.setCurrentPage(pageParam);
        const url = HttpUtil.formatString(
          `${pageParam.ownerUrl}${pageParam.pageMethod}`,
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
    console.log(`qam page`, this.pageType, pageLoaderParam);
    // //    console.log(`${this.options.urlPrefix ? this.options.urlPrefix : ""}/${pageLoaderParam.owner}${pageLoaderParam.owner ? `/${pageParam.module}` : ""}/${pageParam.pageId}`)

    // history.pushState(
    //   null,
    //   "",
    //   `${this.options.urlPrefix ? this.options.urlPrefix : ""}/${pageLoaderParam.owner}${
    //     pageParam.module ? `/${pageParam.module}` : ""
    //   }/${pageParam.pageId}`
    // );
    const doc = this.owner.toNode(
      `<basis core="group" run="atclient"> <basis core="component.basispanel.${this.pageType}" run="atclient" params='${param}'></basis></basis>`
    );
    // doc.querySelector("[params='']").setAttribute("params", param);
    const nodes = Array.from(doc.childNodes);
    this.container.innerHTML = "";
    this.container.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }
}
