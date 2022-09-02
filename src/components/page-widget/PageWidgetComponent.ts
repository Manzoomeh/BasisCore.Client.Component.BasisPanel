import { IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IWidgetParam from "./widget/IWidgetParam";

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
    const widgetTitle = this.container.querySelector("[data-bc-widget-header] > [data-bc-widget-title]");
    if (widgetTitle) {
      widgetTitle.innerHTML = value;
    }
  }

  public get body(): HTMLElement {
    return this.container.querySelector("[data-bc-widget-body]");
  }

  public addNodeToHeader(node: Node): void {
    this.container
      .querySelector("[data-bc-widget-header] > [data-bc-widget-external-buttons]")
      .appendChild(node);
  }

  public addActionToHeader(
    title: string,
    callback: (e: MouseEvent) => void
  ): Node {
    //TODO: add btn style
    const btn = document.createElement("button");
    btn.textContent = title;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      callback(e);
    });
    this.addNodeToHeader(btn);
    return btn;
  }
}

interface IWidget {
  title: string;
  body: HTMLElement;

  addNodeToHeader(node: Node): void;
  addActionToHeader(title: string, callback: (e: MouseEvent) => void): Node;
}
