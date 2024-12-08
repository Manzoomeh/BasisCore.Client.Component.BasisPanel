import { IModuleInfo, PanelLevels } from "../../type-alias";

export default class MenuElement {
  readonly nodes: Array<Node>;
  readonly toolboxNodes: Array<Node>;
  readonly modules: Map<number, IModuleInfo> = new Map<number, IModuleInfo>();
  readonly level: PanelLevels;

  constructor(
    nodes: Array<Node>,
    toolboxNodes: Array<Node>,
    level: PanelLevels,
    modules: Map<number, IModuleInfo>
  ) {
    this.nodes = nodes;
    this.toolboxNodes = toolboxNodes;
    this.level = level;
    this.modules = modules;
  }
}
