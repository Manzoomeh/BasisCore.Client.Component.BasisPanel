import ISource from "../basiscore/ISource";
import IUserDefineComponent from "../basiscore/IUserDefineComponent";
import HttpUtil from "../HttpUtil";
import { DefaultSource, MenuOwnerType } from "../type-alias";
import IProfileInfo from "./profile/IProfileInfo";
import BasisPanelChildComponent from "./BasisPanelChildComponent";
import { IMenuLoaderParam } from "./menu/IMenuInfo";

export default abstract class EntitySelectorComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;
  private element: HTMLOptionElement;

  private ownerType: MenuOwnerType;
  private entityList: Array<IEntityInfo>;

  protected mustReload = true;

  constructor(
    owner: IUserDefineComponent,
    layout: string,
    entityType: MenuOwnerType
  ) {
    super(owner, layout, `data-bc-bp-${entityType}-container`);
    this.ownerType = entityType;
  }

  protected abstract getListUrl(): string;

  protected abstract getOwnerUrl(): string;

  protected abstract getSourceId(): string;

  protected getExtraData(): any {
    return null;
  }

  public initializeAsync(): void | Promise<void> {
    this.element = this.container.querySelector<HTMLOptionElement>(
      "[data-bc-main-list]"
    );
    this.element.addEventListener("click", async (e) => {
      if (this.mustReload) {
        this.mustReload = false;
        await this.fillComboAsync();
      }
    });
    this.element.addEventListener("change", async (e) => {
      e.preventDefault();
      const id = parseInt(this.element.value);
      const entity = this.entityList.find((x) => x.id == id);
      this.owner.setSource(this.getSourceId(), entity ?? {});

      if (this.profile) {
        if (entity) {
          const url = HttpUtil.formatString(this.options.baseUrl.active, {
            rKey: this.options.rKey,
          });
          const result = await HttpUtil.fetchDataAsync(url, "POST", {
            type: this.ownerType,
            id: id,
          });
          console.log(result);
          this.owner.setSource(
            DefaultSource.SHOW_MENU,
            this.createMenuLoaderParam()
          );
        }
      }
    });
    this.owner.addTrigger([DefaultSource.USER_INFO_SOURCE]);
  }

  public async runAsync(source?: ISource) {
    switch (source?.id) {
      case DefaultSource.USER_INFO_SOURCE: {
        this.profile = source.rows[0];
        break;
      }
    }
    return true;
  }

  protected getEntitiesAsync(): Promise<Array<IEntityInfo>> {
    return HttpUtil.formatAndGetDataAsync<Array<IEntityInfo>>(
      this.getListUrl(),
      this.options.rKey,
      this.profile,
      this.getExtraData()
    );
  }
  protected async fillComboAsync() {
    this.entityList = await this.getEntitiesAsync();
    this.clearCombo();
    const option = document.createElement("option");
    option.text = "";
    this.element.appendChild(option);
    this.entityList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id.toString();
      option.text = item.title;
      this.element.appendChild(option);
    });
  }

  protected clearCombo() {
    this.element.innerHTML = "";
  }

  protected createMenuLoaderParam(): IMenuLoaderParam {
    const menuParam: IMenuLoaderParam = {
      owner: this.ownerType,
      ownerId: this.element.value,
      ownerUrl: this.getOwnerUrl(),
      rKey: this.options.rKey,
      menuMethod: this.options.method.menu,
    };
    return menuParam;
  }
}

export interface IEntityInfo {
  id: number;
  title: string;
}
