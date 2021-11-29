import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default abstract class PageWidgetComponent
  extends BasisPanelChildComponent
  implements IWidget
{
  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    super(owner, layout, dataAttr);
    this.owner.dc.registerInstance("widget", this);
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
