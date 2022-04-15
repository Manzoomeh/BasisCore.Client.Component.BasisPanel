import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IWidgetParam from "../widget/IWidgetParam";
import layout from "./assets/layout.html";

export default class PageGroupComponent extends BasisPanelChildComponent {
  readonly Options: any;
  readonly Name: string;
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-group-container");
    this.Name = owner.node.getAttribute("name");
    var optionsName = owner.node.getAttribute("options");
    this.Options = eval(optionsName);
  }

  public initializeAsync(): void | Promise<void> {}
  public runAsync(_?: ISource) {}

  public async addWidgetAsync(widgetParam: IWidgetParam): Promise<void> {
    const widgetElement = document.createElement("basis");

    widgetElement.setAttribute(
      "core",
      `component.basispanel.${widgetParam.container}`
    );
    widgetElement.setAttribute("run", "atclient");
    var optionsName = this.owner.storeAsGlobal(widgetParam);
    widgetElement.setAttribute("options", optionsName);
    this.container.appendChild(widgetElement);
    await this.owner.processNodesAsync([widgetElement]);
  }
}
