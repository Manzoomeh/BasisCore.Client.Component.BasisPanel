import IDisposable from "./IDisposable";

declare type CommandComponent = IComponent;
declare type IComponent = any;

export default interface IComponentCollection extends IDisposable {
  GetCommandListByCore(core: string): Array<CommandComponent>;
  GetCommandList(): Array<CommandComponent>;
  GetComponentList(): Array<IComponent>;
}
