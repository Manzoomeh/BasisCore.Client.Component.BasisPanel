import IComponentManager from "../basiscore/IComponentManager";
import ISource from "../basiscore/ISource";
import IUserDefineComponent from "../basiscore/IUserDefineComponent";
import IBasisPanelOptions from "./basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent
  implements IComponentManager
{
  protected readonly owner: IUserDefineComponent;
  protected readonly container: Element;
  protected options: IBasisPanelOptions;

  constructor(owner: IUserDefineComponent, dataAttr: string) {
    this.owner = owner;
    this.container = document.createElement("div");
    this.container.setAttribute(dataAttr, "");
    this.owner.setContent(this.container);
    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );
  }
  public async initializeAsync(): Promise<void> {
    const style = await this.owner.getAttributeValueAsync("style");
    if (style) {
      this.container.setAttribute("style", style);
    }
  }
  public runAsync(source?: ISource): Promise<any> {
    return Promise.resolve(true);
  }
}
