import IWidgetInfo from "../page-widget/widget/IWidgetInfo";
import IPage from "./IPage";
import IWidgetParam from "../page-widget/widget/IWidgetParam";
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
  public get arguments(): any {
    return this.loaderParam.arguments;
  }
  public abstract get type(): PageType;
  public _groupsAdded: boolean = false;
  readonly _groups: Map<string, PageGroupComponent> = new Map();

  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    super(owner, layout, dataAttr);
    this.owner.dc.registerInstance("page", this);
    const body = this.container.querySelector<HTMLElement>(
      "[data-bc-page-body]"
    );
    
    body.addEventListener("dragenter", (e) => e.preventDefault());
    body.addEventListener("dragover", (e) => e.preventDefault());
    body.addEventListener("drop", (e) =>
      this.tryAddingWidget(JSON.parse(e.dataTransfer.getData("text/plain")))
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
   
    
    this.info = await HttpUtil.fetchDataAsync<IPageInfo>(url, "GET");
    // localStorage.setItem("rkey" ,this.options.rKey  )
    // localStorage.setItem("currentPage" , JSON.stringify(this.info)  )
    const body = this.container.querySelector("[data-bc-page-body]");

    if (this.info.content) {
      const range = new Range();
      range.setStart(body, 0);
      range.setEnd(body, 0);
      range.insertNode(range.createContextualFragment(this.info.content));
    }
  }

  public async runAsync(source?: ISource) {
    if (!this._groupsAdded) {
      await this.addingPageGroupsAsync(this.info);
      this._groupsAdded = true;
    }
    return true;
  }

  public tryAddingWidget(widgetInfo: IWidgetInfo) {
    const param: IWidgetParam = {
      ...widgetInfo,
      ...{ page: this.loaderParam },
    };
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
    const windowHeight = window.innerHeight
    const cell = (pageBody as HTMLElement).offsetWidth / 12;
    const maxHeight = Math.max(...widgets);
    if((cell * maxHeight) > windowHeight){
      (pageBody as HTMLElement).style.height = `${cell * maxHeight}px`;
    }
    else{
      (pageBody as HTMLElement).style.height = `${windowHeight - 195 }px`;
    }
    
  }
}
