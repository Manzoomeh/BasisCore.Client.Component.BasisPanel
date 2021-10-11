import layout from "./assets/layout.html";
import HttpUtil from "../../HttpUtil";
import IWidgetParam from "./IWidgetParam";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import ISource from "../../basiscore/ISource";
import { DefaultSource } from "../../type-alias";

export default class WidgetComponent extends BasisPanelChildComponent {
  private param: IWidgetParam;
  set title(value: string) {
    this.container.querySelector(
      "[data-bc-widget-header] > [data-bc-widget-title]"
    ).textContent = value;
  }
  public async initializeAsync(): Promise<void> {
    this.param = JSON.parse(await this.owner.getAttributeValueAsync("param"));

    this.container.setAttribute("gs-x", this.param.x.toString());
    this.container.setAttribute("gs-y", this.param.y.toString());
    this.container.setAttribute("gs-w", this.param.w.toString());
    this.container.setAttribute("gs-h", this.param.h.toString());

    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    const cell = parent.offsetWidth / 12;

    (this.container as HTMLElement).style.height = `${this.param.h * cell}px`;
    (this.container as HTMLElement).style.top = `${
      this.param.y * cell + parent.offsetTop
    }px`;
    (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    this.title = this.param.title;
    const url = HttpUtil.formatString(
      `${this.param.page.ownerUrl}${this.options.method.widget}`,
      { rKey: this.options.rKey, widgetId: this.param.id }
    );
    var content = await HttpUtil.fetchStringAsync(url, "GET");
    const range = new Range();
    const container = this.container.querySelector(
      "[data-bc-widget-body-container]"
    );
    range.setStart(container, 0);
    range.setEnd(container, 0);
    const newContent = range.createContextualFragment(content);
    const nodes = Array.from(newContent.childNodes);
    range.insertNode(newContent);
    this.owner.processNodesAsync(nodes);
    this.container
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.removeAsync();
        })
      );
  }

  public runAsync(source?: ISource) {
    return true;
  }

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-page-container");
  }

  private async removeAsync(): Promise<void> {
    await this.owner.disposeAsync();
    this.container.remove();
    this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
  }
}