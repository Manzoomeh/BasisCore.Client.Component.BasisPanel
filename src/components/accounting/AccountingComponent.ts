import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { IQuestionItem } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import html from "./assets/layout.html";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import ISource from "../../basiscore/ISource";

export default class AccountingComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IUserDefineComponent) {
    super(owner, "data-bc-bp-accounting-container");
    this.container.innerHTML = html;
  }

  public runAsync(source?: ISource): Promise<any> {
    return this.loadDataAsync();
  }

  public async loadDataAsync(): Promise<void> {
    const questions = await HttpUtil.getDataAsync<Array<IQuestionItem>>(
      this.options.accountingUrl
    );
    this.profile = QuestionUtil.toObject(questions);
    console.log(this.profile);
    this.refreshUI();
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
