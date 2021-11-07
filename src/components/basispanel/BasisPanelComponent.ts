import "./assets/style.css";
import layout from "./assets/layout.html";
import ISourceOptions from "../../basiscore/ISourceOptions";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import IDisposable from "../../basiscore/IDisposable";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

declare const $bc: any;
export default class BasisPanelComponent extends BasisPanelChildComponent {
  private runTask: Promise<IDisposable>;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-main-container");
    $bc.basisPanel = {};
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    if (!this.runTask) {
      this.runTask = this.owner.processNodesAsync(
        Array.from(this.container.childNodes)
      );
    }
    return this.runTask;
  }

  public async initializeAsync(): Promise<void> {
    const style = await this.owner.getAttributeValueAsync("style");
    if (style) {
      this.container.setAttribute("style", style);
    }
  }
}
