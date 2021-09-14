import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { DefaultSource, IQuestionItem } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import html from "./assets/layout.html";
import "./assets/style.css";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import ISource from "../../basiscore/ISource";
import { IMenuLoaderParam } from "../menu/IMenuInfo";

export default class AccountingComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-accounting-container");
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
      `return \`${this.options.dataUrl.user}\``
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
        ownerId: 0,
        profile: this.profile,
        ownerUrl: this.options.baseUrl.user,
        rKey: this.options.rKey,
        menuMethod: this.options.method.menu,
      };
      this.owner.setSource(DefaultSource.SHOW_MENU, menuInfo);
    }
  }

  private refreshUI() {
    const ui = this.container.querySelector<HTMLDivElement>(
      "[data-bc-user-name]"
    );
    ui.textContent = `${this.profile.fName} ${this.profile.lName}`;
    const fn = new Function(
      "rKey",
      "profile",
      `return \`${`${this.options.baseUrl.user}${this.options.method.userImage}`}\``
    );
    this.container.querySelector<HTMLImageElement>("[data-bc-user-image]").src =
      fn(this.options.rKey, this.profile);
  }
}
