import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IWidgetParam from "../widget/IWidgetParam";

export default abstract class PageWidgetComponent
  extends BasisPanelChildComponent
  implements IWidget
{
  protected readonly param: IWidgetParam;
  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    super(owner, layout, dataAttr);
    this.owner.dc.registerInstance("widget", this);
    this.param = eval(this.owner.node.getAttribute("options"));
  }

  public get title(): string {
    return this.container.querySelector(
      "[data-bc-widget-header] > [data-bc-widget-title]"
    )?.innerHTML;
  }
  set title(value: string) {
    this.container.querySelector(
      "[data-bc-widget-header] > [data-bc-widget-title]"
    ).innerHTML = value;
  }
}

interface IWidget {
  title: string;
}
