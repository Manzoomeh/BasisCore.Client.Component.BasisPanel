import { IComponentManager, ISource, IUserDefineComponent } from "basiscore";
import IBasisPanelOptions, { ICultureOptions, IDirection } from "./basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent
  implements IComponentManager
{
  protected readonly owner: IUserDefineComponent;
  public readonly container: Element;
  protected readonly options: IBasisPanelOptions;
  protected readonly direction: IDirection;
  static _cultureDefaults: Partial<ICultureOptions>;
  static getDefaultCultures(): Partial<ICultureOptions> {
    if (!BasisPanelChildComponent._cultureDefaults) {
      BasisPanelChildComponent._cultureDefaults = {
        direction: "rightToLeft",
      };
    }
    return BasisPanelChildComponent._cultureDefaults;
  }

  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    this.owner = owner;
    this.container = document.createElement("div");
    this.container.setAttribute(dataAttr, "");
    this.owner.setContent(this.container);

    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );

    this.direction = this.options.culture?.direction ?? BasisPanelChildComponent.getDefaultCultures().direction;
    this.container.setAttribute("data-bc-bp-direction", this.direction);

    if (layout?.length > 0) {
      const range = new Range();
      range.setStart(this.container, 0);
      range.setEnd(this.container, 0);
      range.insertNode(range.createContextualFragment(layout));
    }
  }
  public abstract initializeAsync(): Promise<void>;
  public abstract runAsync(source?: ISource): any | Promise<any>;
}
