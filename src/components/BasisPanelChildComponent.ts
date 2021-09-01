import IBasisPanel from "./basispanel/IBasisPanel";

export default abstract class BasisPanelChildComponent {
  protected readonly owner: IBasisPanel;
  protected readonly container: Element;

  constructor(owner: IBasisPanel, container: Element) {
    this.owner = owner;
    this.container = container;
  }
}
