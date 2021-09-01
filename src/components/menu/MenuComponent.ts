import IBasisPanel from "../basispanel/IBasisPanel";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class MenuComponent extends BasisPanelChildComponent {
  constructor(owner: IBasisPanel, container: Element) {
    super(owner, container);
  }
}
