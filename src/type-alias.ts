export interface IQuestionItem {
  prpid: number;
  question: string;
  answer: string;
}

export class DefaultSource {
  static readonly USER_INFO_SOURCE = "basispanel.userinfo";
  static readonly SHOW_MENU = "basispanel.show_menu";
  static readonly CORPORATE_SOURCE = "basispanel.corporate";
  static readonly BUSINESS_SOURCE = "basispanel.business";
}

export interface IDictionary<TValue> {
  [Key: string]: TValue;
}
