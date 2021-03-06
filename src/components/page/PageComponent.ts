import IPage from "./IPage";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import { IUserDefineComponent, ISource } from "basiscore";
import HttpUtil from "../../HttpUtil";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import IPageInfo from "./IPageInfo";
import { PageType } from "./PageType";
import { IPageGroupInfo } from "./IPageGroupInfo";
import PageGroupComponent from "../page-group/PageGroupComponent";

export default abstract class PageComponent
  extends BasisPanelChildComponent
  implements IPage
{
  public loaderParam: IPageLoaderParam;
  public info: IPageInfo;
  public readonly widgetDropAreaContainer: HTMLElement;
  public get arguments(): any {
    return this.loaderParam.arguments;
  }
  public abstract get type(): PageType;
  public _groupsAdded: boolean = false;
  readonly _groups: Map<string, PageGroupComponent> = new Map();

  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    super(owner, layout, dataAttr);
    this.owner.dc.registerInstance("page", this);
    this.widgetDropAreaContainer = this.container.querySelector<HTMLElement>(
      "[data-bc-widget-drop-area-container]"
    );
  }

  public async initializeAsync(): Promise<void> {
    this.loaderParam = JSON.parse(
      await this.owner.getAttributeValueAsync("params")
    );
    const url = HttpUtil.formatString(
      `${this.loaderParam.ownerUrl}${this.loaderParam.pageMethod}`,
      this.loaderParam
    );

    this.info = await HttpUtil.checkRkeyFetchDataAsync<IPageInfo>(
      url,
      "GET",
      this.options.checkRkey
    );
  }

  public async runAsync(source?: ISource) {
    if (!this._groupsAdded) {
      await this.addingPageGroupsAsync(this.info);
      this._groupsAdded = true;
    }
    return true;
  }

  public async addGroupAsync(
    groupInfo: IPageGroupInfo
  ): Promise<PageGroupComponent> {
    try {
      const pageBody = this.container.querySelector('[data-bc-page-body=""]');
      const groupElement = document.createElement("basis");
      var optionsName = this.owner.storeAsGlobal(groupInfo.options);
      groupElement.setAttribute("core", "component.basispanel.pageGroup");
      groupElement.setAttribute("run", "atclient");
      groupElement.setAttribute("name", groupInfo.groupName);
      groupElement.setAttribute("options", optionsName);

      pageBody.appendChild(groupElement);
      const components = await this.owner.processNodesAsync([groupElement]);
      const groupContainer =
        components.GetComponentList()[0] as any as IUserDefineComponent;
      const group = groupContainer.manager as any as PageGroupComponent;
      this._groups.set(group.Name, group);
      return group;
    } catch (ex) {
      console.error(ex);
    }
  }

  public async addingPageGroupsAsync(pageInfo: IPageInfo): Promise<void> {
    const widgets: Array<number> = [];
    const pageBody = this.container.querySelector('[data-bc-page-body=""]');

    for (var i = 0; i < pageInfo.groups.length; i++) {
      const groupInfo = pageInfo.groups[i];
      const group = await this.addGroupAsync(groupInfo);
      const widgetParamList = groupInfo.widgets.map((widgetInfo) => {
        widgets.push(widgetInfo.y + widgetInfo.h);
        return { ...widgetInfo, ...{ page: this.loaderParam } };
      });
      group.addWidgetAsync(...widgetParamList);
    }
    const windowHeight = window.innerHeight;
    const cell = (pageBody as HTMLElement).offsetWidth / 12;
    const maxHeight = Math.max(...widgets);

    const headerHeight = (
      document.querySelector("[data-bc-bp-main-header]") as HTMLElement
    ).offsetHeight;
    const menuHeight = (
      document.querySelector("[data-bc-bp-menu-container]") as HTMLElement
    ).offsetHeight;
    const footerHeight = (
      document.querySelector("[data-bc-bp-footer-container]") as HTMLElement
    ).offsetHeight;
    const otherHeight = headerHeight + menuHeight + footerHeight;

    if (cell * maxHeight > windowHeight - otherHeight) {
      (pageBody as HTMLElement).style.height = `${cell * maxHeight}px`;
    } else {
      (pageBody as HTMLElement).style.height = `${
        windowHeight - otherHeight
      }px`;
    }
  }
}
