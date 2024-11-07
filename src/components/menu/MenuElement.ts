import { IModuleInfo, MenuOwnerType, PanelLevels } from "../../type-alias";
import { IMenuLoaderParam } from "./IMenuInfo";

export default class MenuElement {
  readonly nodes: Array<Node>;
  //readonly param: IMenuLoaderParam;
  //readonly pageLookup: Map<string, IMenuLoaderParam>;
  //readonly menuItemLookup: Map<string, HTMLElement[]>;
  readonly modules: Map<number, IModuleInfo> = new Map<number, IModuleInfo>();
  readonly level: PanelLevels;

  constructor(
    //param: IMenuLoaderParam,
    //pageLookup: Map<string, IMenuLoaderParam>,
    nodes: Array<Node>,
    level: PanelLevels,
    modules: Map<number, IModuleInfo>
  ) {
    this.nodes = nodes;
    this.level = level;
    //this.param = param;
    //this.pageLookup = pageLookup;
    this.modules = modules;
  }
}
