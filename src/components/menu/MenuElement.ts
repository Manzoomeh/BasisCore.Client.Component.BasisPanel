import { MenuOwnerType } from "../../type-alias";
import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly param: IMenuLoaderParam;
  readonly pageLookup: Map<string, IMenuLoaderParam>;
  readonly menuItemLookup: Map<string, HTMLElement[]>;

  constructor(
    param: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    nodes: Array<Node>, menuItemLookup: Map<string, HTMLElement[]>
  ) {
    this.nodes = nodes;
    this.param = param;
    this.pageLookup = pageLookup;
    this.menuItemLookup = menuItemLookup;
  }
}
