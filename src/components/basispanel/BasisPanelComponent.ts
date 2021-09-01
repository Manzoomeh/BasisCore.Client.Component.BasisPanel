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

export default class BasisPanelComponent implements IBasisPanel {
  private readonly accounting: AccountingComponent;
  public readonly rKey: string;
  private readonly container: Element;
  readonly options: IBasisPanelOptions;
  private readonly components: Array<IBasisPanelChildComponents>;

  constructor(rKey: string, container: Element, options: IBasisPanelOptions) {
    this.rKey = rKey;
    this.options = options;
    this.container = container;
    container.innerHTML = layout;

    this.accounting = new AccountingComponent(
      this,
      container.querySelector("[data-bc-bp-accounting-container]")
    );
    const accounting = new MenuComponent(
      this,
      this.container.querySelector("[data-bc-bp-menu-container]")
    );
    const corporateSelector = new CorporateSelectorComponent(
      this,
      this.container.querySelector("[data-bc-bp-corporate-container]")
    );
    const businessSelector = new BusinessSelectorComponent(
      this,
      this.container.querySelector("[data-bc-bp-business-container]")
    );
    const workspace = new WorkspaceComponent(
      this,
      this.container.querySelector("[data-bc-bp-workspace-container]")
    );
    const footer = new FooterComponent(
      this,
      this.container.querySelector("[data-bc-bp-footer-container]")
    );

    this.components = [
      accounting,
      corporateSelector,
      businessSelector,
      workspace,
      footer,
    ];
  }

  public async initializeAsync(): Promise<void> {
    await this.accounting.loadDataAsync();
  }
}
