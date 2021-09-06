import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly key: number;
  readonly type: string;

  constructor(menuParam: IMenuLoaderParam, nodes: Array<Node>) {
    this.nodes = nodes;
    this.type = menuParam.type;
    this.key = menuParam.key;
  }
}
