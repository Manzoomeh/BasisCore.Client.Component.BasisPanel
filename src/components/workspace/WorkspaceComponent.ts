import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import HttpUtil from "../../HttpUtil";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { IPageLoaderParam } from "../menu/IPageInfo";
import html from "./assets/layout.html";
import "./assets/style.css";
import IPageContainer from "./IPageContainer";
import PageComponent from "../page/PageComponent";
import IPageInfo from "../page/IPageInfo";
import IPageParam from "../menu/IPageParam";

export default class WorkspaceComponent
  extends BasisPanelChildComponent
  implements IPageContainer
{
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-workspace-container");
  }
  addPageContent(element: Element): void {
    this.container.appendChild(element);
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE]);
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      const pageParam = source.rows[0] as IPageLoaderParam;
      //console.log(pageParam);
      this.displayPageAsync(pageParam);
    }
    return true;
  }

  private async displayPageAsync(
    pageLoaderParam: IPageLoaderParam
  ): Promise<void> {
    var url = HttpUtil.formatString(
      `${pageLoaderParam.ownerUrl}${pageLoaderParam.pageMethod}`,
      pageLoaderParam
    );
    this.container.innerHTML = "";
    const pageParam: IPageParam = {
      ...pageLoaderParam,
      ...{ pageInfo: await HttpUtil.fetchDataAsync<IPageInfo>(url, "GET") },
    };
    const page = new PageComponent(this, pageParam, this.options);
  }
}
