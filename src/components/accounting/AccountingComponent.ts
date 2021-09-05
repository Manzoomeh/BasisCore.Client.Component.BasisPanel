import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { DefaultSource, IQuestionItem } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import html from "./assets/layout.html";
import "./assets/style.css";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import ISource from "../../basiscore/ISource";
import { SourceId } from "../../basiscore/type-alias";

export default class AccountingComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IUserDefineComponent) {
    super(owner, html, "data-bc-bp-accounting-container");
  }

  public runAsync(source?: ISource): Promise<any> {
    return this.loadDataAsync();
  }

  public initializeAsync(): void | Promise<void> {}

  public async loadDataAsync(): Promise<void> {
    const urlFormatter = new Function(
      "rKey",
      `return \`${this.options.accountingUrl}\``
    );
    const questions = await HttpUtil.getDataAsync<Array<IQuestionItem>>(
      urlFormatter(this.options.rKey)
    );
    this.profile = QuestionUtil.toObject(questions);
    this.refreshUI();
    this.owner.setSource(DefaultSource.USER_INFO_SOURCE, this.profile);
  }

  public refreshUI() {
    const ui = this.container.querySelector<HTMLDivElement>(
      "[data-bc-user-name]"
    );
    ui.textContent = `${this.profile.fName} ${this.profile.lName}`;
    const fn = new Function(
      "rKey",
      "profile",
      `return \`${this.options.profileImageUrl}\``
    );
    this.container.querySelector<HTMLImageElement>("[data-bc-user-image]").src =
      fn(this.options.rKey, this.profile);
  }
}
