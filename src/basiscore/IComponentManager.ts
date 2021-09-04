import ISource from "./ISourceOptions";

export default interface IComponentManager {
  initializeAsync(): Promise<void> | void;
  runAsync(source?: ISource): Promise<any> | any;
}
