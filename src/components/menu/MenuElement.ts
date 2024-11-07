import { IModuleInfo, PanelLevels } from "../../type-alias";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly modules: Map<number, IModuleInfo> = new Map<number, IModuleInfo>();
  readonly level: PanelLevels;

  constructor(
    nodes: Array<Node>,
    level: PanelLevels,
    modules: Map<number, IModuleInfo>
  ) {
    this.nodes = nodes;
    this.level = level;
    this.modules = modules;
  }
}
