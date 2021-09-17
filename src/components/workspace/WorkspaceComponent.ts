import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { DefaultSource } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import html from "./assets/layout.html";
import "./assets/style.css";

export default class WorkspaceComponent extends BasisPanelChildComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-workspace-container");
  }

  public initializeAsync(): void | Promise<void> {
    this.owner.addTrigger([DefaultSource.DISPLAY_PAGE]);
  }

  public runAsync(source?: ISource) {
    if (source?.id === DefaultSource.DISPLAY_PAGE) {
      const pageParam = source.rows[0] as IPageLoaderParam;
      this.displayPageAsync(pageParam);
    }
    return true;
  }

  private async displayPageAsync(
    pageLoaderParam: IPageLoaderParam
  ): Promise<void> {
    const param = JSON.stringify(pageLoaderParam);
    const doc = this.owner.toNode(
      `<basis core="group" run="atclient"> <basis core="component.basispanel.page" run="atclient"  params='${param}' ></basis></basis>`
    );
    const nodes = Array.from(doc.childNodes);
    this.container.appendChild(doc);
    this.owner.processNodesAsync(nodes);
  }
}
