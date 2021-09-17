import html from "./assets/layout.html";
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
    this.title = this.param.title;
    const url = HttpUtil.formatString(
      `${this.param.page.ownerUrl}${this.options.method.widget}`,
      { rKey: this.options.rKey, widgetId: this.param.id }
    );
    var content = await HttpUtil.fetchStringAsync(url, "GET");
    const range = new Range();
    range.selectNode(
      this.container.querySelector("[data-bc-widget-body-container]")
    );
    const newContent = range.createContextualFragment(content);
    range.insertNode(newContent);
    this.container
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.remove();
        })
      );
  }

  public runAsync(source?: ISource) {
    return true;
  }

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-page-container");
  }

  private remove() {
    this.container.remove();
    this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
  }
}
