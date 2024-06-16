import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly param: IMenuLoaderParam;
  readonly pageLookup: Map<string, IMenuLoaderParam>;

  constructor(
    param: IMenuLoaderParam,
    pageLookup: Map<string, IMenuLoaderParam>,
    nodes: Array<Node>
  ) {
    this.nodes = nodes;
    this.param = param;
    this.pageLookup = pageLookup;
  }
}
