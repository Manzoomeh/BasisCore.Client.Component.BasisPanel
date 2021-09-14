import IWidgetInfo from "./IWidgetInfo";
import html from "./assets/layout.html";
import IWidgetContainer from "../page/IWidgetContainer";

export default class WidgetComponent {
  private readonly _owner: IWidgetContainer;
  private readonly _widgetInfo: IWidgetInfo;
  public readonly _content: Element;
  constructor(owner: IWidgetContainer, widgetInfo: IWidgetInfo) {
    this._owner = owner;
    this._widgetInfo = widgetInfo;
    this._content = document.createElement("div");
    this._content.innerHTML = html;
    this._owner.addWidgetContent(this._content);

    this.setTitle(widgetInfo.title);
    this._content
      .querySelectorAll("[data-bc-widget-btn-close]")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this._content.remove();
          this._owner.closeWidget(this._widgetInfo);
        })
      );
  }

  public setTitle(title: string) {
    this._content.querySelector(
      "[data-bc-widget-header] > [data-bc-widget-title]"
    ).textContent = title;
  }
}
