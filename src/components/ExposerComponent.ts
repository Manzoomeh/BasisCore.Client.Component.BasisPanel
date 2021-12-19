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
    if (component) {
      this.owner.storeAsGlobal(this, component);
    }
  }

  async runAsync(source?: ISourceOptions) {
    const method = await this.owner.getAttributeValueAsync("Method");
    if (method) {
      const callBack = eval(method);
      Reflect.apply(callBack, null, [this, source]);
    }
  }
}
