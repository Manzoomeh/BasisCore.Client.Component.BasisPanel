import IBasisPanelOptions from "./IBasisPanelOptions";
import "./assets/style.css";
import layout from "./assets/layout.html";
import IComponentManager from "../../basiscore/IComponentManager";
import ISourceOptions from "../../basiscore/ISourceOptions";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import IDisposable from "../../basiscore/IDisposable";

export default class BasisPanelComponent implements IComponentManager {
  readonly owner: IUserDefineComponent;
  public rKey: string;
  private content: Element;
  private options: IBasisPanelOptions;
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    this.owner = owner;
    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    if (!this.runTask) {
      this.runTask = this.owner.processNodesAsync(
        Array.from(this.content.childNodes)
      );
    }
    return this.runTask;
  }

  public async initializeAsync(): Promise<void> {
    this.content = document.createElement("div");
    const style = await this.owner.getAttributeValueAsync("style");
    if (style) {
      this.content.setAttribute("style", style);
    }
    this.owner.setContent(this.content);
    this.content.innerHTML = layout;
    this.rKey = await this.owner.getAttributeValueAsync("rKey");
  }
}
