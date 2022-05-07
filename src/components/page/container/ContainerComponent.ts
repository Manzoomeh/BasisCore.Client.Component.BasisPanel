import { IUserDefineComponent } from "basiscore";
import layout from "./assets/layout.html";
import PageComponent from "../PageComponent";
import { PageType } from "../PageType";
export default class ContainerComponent extends PageComponent {
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-page-container");
  }
  public get type(): PageType {
    return PageType.Dashboard;
  }
}
