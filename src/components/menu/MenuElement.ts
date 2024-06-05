import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly param: IMenuLoaderParam;

  constructor(param: IMenuLoaderParam, nodes: Array<Node>) {
    this.nodes = nodes;
    this.param = param;
  }
}
