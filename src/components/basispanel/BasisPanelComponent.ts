import AccountingComponent from "../accounting/AccountingComponent";
import MenuComponent from "../menu/MenuComponent";
import IBasisPanel from "./IBasisPanel";
import IBasisPanelChildComponents from "./IBasisPanelChildComponents";
import IBasisPanelOptions from "./IBasisPanelOptions";
import "./assets/style.css";
import layout from "./assets/layout.html";
import CorporateSelectorComponent from "../corporate-selector/CorporateSelectorComponent";
import BusinessSelectorComponent from "../business-selector/BusinessSelectorComponent";
import WorkspaceComponent from "../workspace/WorkspaceComponent";
import FooterComponent from "../footer/FooterComponent";
import IComponentManager from "../../basiscore/IComponentManager";
import ISourceOptions from "../../basiscore/ISourceOptions";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";

export default class BasisPanelComponent
  implements IComponentManager, IBasisPanel
{
  readonly owner: IUserDefineComponent;
  private accounting: AccountingComponent;
  public rKey: string;
  private content: Element;
  options: IBasisPanelOptions;
  private components: Array<IBasisPanelChildComponents>;
  private runTask: Promise<void>;

  constructor(owner: IUserDefineComponent) {
    this.owner = owner;
    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );
  }

  async runAsync(source?: ISourceOptions): Promise<any> {
    await this.accounting.loadDataAsync();
    // const collection = this.owner.container.resolve(ComponentCollection);
    // await collection.processNodesAsync(childNodes);

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

    this.accounting = new AccountingComponent(
      this,
      this.content.querySelector("[data-bc-bp-accounting-container]")
    );
    const accounting = new MenuComponent(
      this,
      this.content.querySelector("[data-bc-bp-menu-container]")
    );
    const corporateSelector = new CorporateSelectorComponent(
      this,
      this.content.querySelector("[data-bc-bp-corporate-container]")
    );
    const businessSelector = new BusinessSelectorComponent(
      this,
      this.content.querySelector("[data-bc-bp-business-container]")
    );
    const workspace = new WorkspaceComponent(
      this,
      this.content.querySelector("[data-bc-bp-workspace-container]")
    );
    const footer = new FooterComponent(
      this,
      this.content.querySelector("[data-bc-bp-footer-container]")
    );

    this.components = [
      accounting,
      corporateSelector,
      businessSelector,
      workspace,
      footer,
    ];
  }
}
