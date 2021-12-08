import IComponentManager from "../basiscore/IComponentManager";
import ISourceOptions from "../basiscore/ISourceOptions";
import IUserDefineComponent from "../basiscore/IUserDefineComponent";

export default class ExposerComponent implements IComponentManager {
  private readonly owner: IUserDefineComponent;
  constructor(owner: IUserDefineComponent) {
    this.owner = owner;
  }

  async initializeAsync(): Promise<void> {
    const component = await this.owner.getAttributeValueAsync("Component");
    this.owner.storeAsGlobal(this, component);
  }

  runAsync(source?: ISourceOptions) {}
}
