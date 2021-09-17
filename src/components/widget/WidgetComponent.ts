import IWidgetInfo from "./IWidgetInfo";
import html from "./assets/layout.html";
import IWidgetContainer from "../page/IWidgetContainer";
import IBasisPanelOptions from "../basispanel/IBasisPanelOptions";
import HttpUtil from "../../HttpUtil";
import IWidgetParam from "./IWidgetParam";

export default class WidgetComponent {
  private readonly _owner: IWidgetContainer;
  private readonly _param: IWidgetParam;
  public readonly _content: Element;
  constructor(owner: IWidgetContainer, param: IWidgetParam) {
    this._owner = owner;
    this._param = param;
    this._content = document.createElement("div");
    this._content.innerHTML = html;
    this._owner.addWidgetContent(this._content);

    this.setTitle(param.title);
    this._content
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this._content.remove();
          this._owner.closeWidget(this._param);
        })
      );
  }

  public async loadAsync(): Promise<void> {
    const url = HttpUtil.formatString(
      `${this._param.pageParam.ownerUrl}${this._param.widgetMethod}`,
      { rKey: this._param.pageParam.rKey, widgetId: this._param.id }
    );
    var content = await HttpUtil.fetchStringAsync(url, "GET");
    const range = new Range();
    range.selectNode(
      this._content.querySelector("[data-bc-widget-body-container]")
    );
    const newContent = range.createContextualFragment(content);
    range.insertNode(newContent);
  }
  public setTitle(title: string) {
    this._content.querySelector(
      "[data-bc-widget-header] > [data-bc-widget-title]"
    ).textContent = title;
  }
}
