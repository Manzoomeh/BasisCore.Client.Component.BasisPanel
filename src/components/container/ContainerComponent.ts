import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import layout from "./assets/layout.html";
import PageComponent from "../page/PageComponent";
import { PageType } from "../page/PageType";
export default class ContainerComponent
  extends PageComponent { 

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-page-container");
  }
  public   get type():PageType {
		return PageType.Dashboard
	}

}
