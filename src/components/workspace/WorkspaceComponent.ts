import { ISource, IUserDefineComponent } from "basiscore";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import layout from "./assets/layout.html";
import "./assets/style.css";
import HttpUtil from "../../HttpUtil";
import LocalStorageUtil from "../../LocalStorageUtil";
export default class WorkspaceComponent extends BasisPanelChildComponent {
  private pageType: string;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-workspace-container");
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      const pageParam = source.rows[0] as IPageLoaderParam;
      LocalStorageUtil.setCurrentPage(pageParam);
      const url = HttpUtil.formatString(
        `${pageParam.ownerUrl}${pageParam.pageMethod}`,
        pageParam
      );
      let info = await HttpUtil.fetchDataAsync(url, "GET");
      this.pageType = info["container"];
      this.displayPageAsync(pageParam);
    }
    return true;
  }

  private async displayPageAsync(
    pageLoaderParam: IPageLoaderParam
  ): Promise<void> {
    const param = JSON.stringify(pageLoaderParam);
    const doc = this.owner.toNode(
      `<basis core="group" run="atclient"> <basis core="component.basispanel.${this.pageType}" run="atclient"  params='${param}' ></basis></basis>`
    );
    // doc.querySelector("[params='']").setAttribute("params", param);
    const nodes = Array.from(doc.childNodes);
    this.container.innerHTML = "";
    this.container.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }
}
