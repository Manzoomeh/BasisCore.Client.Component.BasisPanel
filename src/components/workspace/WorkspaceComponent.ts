import { ISource, IUserDefineComponent } from "basiscore";
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
  private _isSilent: boolean = false;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, layout, "data-bc-bp-workspace-container");
  }

  public initializeAsync(): Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE, DefaultSource.SET_PAGE]);
    return Promise.resolve();
  }

  public async runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      let pageParam: IPageLoaderParam = source.rows[0] as IPageLoaderParam;
      await this.displayPageAsync(pageParam);
    } else if (source?.id === DefaultSource.SET_PAGE) {
      this._isSilent = true;
      let pageParam: IPageLoaderParam = source.rows[0] as IPageLoaderParam;
      pageParam.rKey = this.options.rKey;
      await this.displayPageAsync(pageParam);
      this._isSilent = false;
    }
    return true;
  }

  private async displayPageAsync(pageParam: IPageLoaderParam): Promise<void> {
    if (pageParam) {
      LocalStorageUtil.setCurrentPage(pageParam);
      const url = HttpUtil.formatString(
        `${pageParam.ownerUrl}${pageParam.pageMethod}`,
        pageParam
      );

      let info = await HttpUtil.checkRKeyFetchDataAsync<IPageInfo>(
        url,
        "GET",
        this.options.checkRkey
      );
      this.pageType = info?.container;
      const param = JSON.stringify(pageParam);
      const currentState = LocalStorageUtil.getLastState();
      const pageName =
        currentState.b?.title ?? currentState.c?.title ?? pageParam.owner;
      if (!this._isSilent) {
        history.pushState(currentState, "", `/${pageName}#${pageParam.pageId}`);
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
}
