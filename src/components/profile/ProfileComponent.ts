import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { DefaultSource, IQuestionItem } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import layout from "./assets/layout.html";
import "./assets/style.css";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import ISource from "../../basiscore/ISource";
import { IMenuLoaderParam } from "../menu/IMenuInfo";
import IPageLoaderParam from "../menu/IPageLoaderParam";

export default class ProfileComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-profile-container");
  }

  public runAsync(source?: ISource): Promise<any> {
    return this.loadDataAsync();
  }

  public initializeAsync(): void | Promise<void> {
    this.container.addEventListener("click", (e) => {
      e.preventDefault();
      this.signalToDisplayMenu();
    });
  }

  public async loadDataAsync(): Promise<void> {
    const urlFormatter = new Function(
      "rKey",
      `return \`${this.options.dataUrl.profile}\``
    );
    const questions = await HttpUtil.getDataAsync<Array<IQuestionItem>>(
      urlFormatter(this.options.rKey)
    );
    this.profile = QuestionUtil.toObject(questions);
    this.refreshUI();
    this.owner.setSource(DefaultSource.USER_INFO_SOURCE, this.profile);
    this.signalToDisplayMenu();
  }

  private signalToDisplayMenu() {
    if (this.profile) {
      const menuInfo: IMenuLoaderParam = {
        owner: "profile",
        ownerId: "",
        ownerUrl: this.options.baseUrl.profile,
        rKey: this.options.rKey,
        menuMethod: this.options.method.menu,
      };
      this.owner.setSource(DefaultSource.SHOW_MENU, menuInfo);
      this.signalToDisplayPage();
    }
  }

  private signalToDisplayPage() {
    const newParam: IPageLoaderParam = {
      pageId: "default",
      owner: "profile",
      ownerId: "",
      ownerUrl: this.options.baseUrl.profile,
      rKey: this.options.rKey,
      pageMethod: this.options.method.page,
    };
    this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  }

  private refreshUI() {
    const ui = this.container.querySelector<HTMLDivElement>(
      "[data-bc-user-name]"
    );
    ui.textContent = `${this.profile.fName} ${this.profile.lName}`;
    const fn = new Function(
      "rKey",
      "profile",
      `return \`${`${this.options.baseUrl.profile}${this.options.method.userImage}`}\``
    );
    this.container.querySelector<HTMLImageElement>("[data-bc-user-image]").src =
      fn(this.options.rKey, this.profile);
  }
}
