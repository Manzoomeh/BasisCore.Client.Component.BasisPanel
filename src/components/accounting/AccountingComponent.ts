import HttpUtil from "../../HttpUtil";
import { QuestionUtil } from "../../QuestionUtil";
import { IQuestionItem } from "../../type-alias";
import IBasisPanel from "../basispanel/IBasisPanel";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IProfileInfo from "./IProfileInfo";
import html from "./assets/layout.html";

export default class AccountingComponent extends BasisPanelChildComponent {
  private profile: IProfileInfo;

  constructor(owner: IBasisPanel, container: Element) {
    super(owner, container);
    container.innerHTML = html;
  }

  public async loadDataAsync(): Promise<void> {
    const questions = await HttpUtil.getDataAsync<Array<IQuestionItem>>(
      this.owner.options.accountingUrl
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
      `return \`${this.owner.options.profileImageUrl}\``
    );
    this.container.querySelector<HTMLImageElement>("[data-bc-user-image]").src =
      fn(this.owner.rKey, this.profile);
  }
}
