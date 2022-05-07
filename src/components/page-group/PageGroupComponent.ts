import { ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IWidgetParam from "../page-widget/widget/IWidgetParam";
import layout from "./assets/layout.html";

export default class PageGroupComponent extends BasisPanelChildComponent {
  readonly Name: string;
  private _group: any;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-group-container");
    this.Name = owner.node.getAttribute("name");
  }

  public async initializeAsync(): Promise<void> {
    var optionsName = this.owner.node.getAttribute("options");
    const groupElement = this.container.querySelector("basis");
    if (optionsName) {
      groupElement.setAttribute("options", optionsName);
    }
    const commandCollection = await this.owner.processNodesAsync([
      groupElement,
    ]);
    this._group = commandCollection.GetCommandListByCore("group")[0];
  }

  public runAsync(_?: ISource) {}

  public async addWidgetAsync(
    ...widgetParamList: IWidgetParam[]
  ): Promise<void> {
    const elementList = new Array<Node>();
    widgetParamList.forEach((widgetParam) => {
      const widgetElement = document.createElement("basis");
      widgetElement.setAttribute(
        "core",
        `component.basispanel.${widgetParam.container}`
      );
      widgetElement.setAttribute("run", "atclient");
      var optionsName = this.owner.storeAsGlobal(widgetParam);
      widgetElement.setAttribute("options", optionsName);
      this.container.appendChild(widgetElement);
      elementList.push(widgetElement);
    });
    await this._group.processNodesAsync(elementList);
  }
}
