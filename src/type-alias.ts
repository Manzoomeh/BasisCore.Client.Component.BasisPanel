export interface IQuestionItem {
  prpid: number;
  question: string;
  answer: string;
}

export class DefaultSource {
  static readonly USER_INFO_SOURCE = "basispanel.userinfo";
  static readonly SHOW_MENU = "basispanel.show_menu";
  static readonly EMPTY_MENU = "basispanel.empty_menu";
  static readonly CORPORATE_SOURCE = "basispanel.corporate";
  static readonly BUSINESS_SOURCE = "basispanel.business";
  static readonly DISPLAY_PAGE = "basispanel.display_page";
  static readonly WIDGET_CLOSED = "basispanel.widget_closed";
  static readonly TASK_START = "basispanel.task_start";
  static readonly TASK_INIT = "basispanel.task_init";
}

export interface IDictionary<TValue> {
  [Key: string]: TValue;
}

export type MenuOwnerType = "corporate" | "business" | "profile" | "external";

export interface ILoaderParam {
  owner: MenuOwnerType;
  ownerId: string;
  ownerUrl: string;
  rKey: string;
}

export interface IBasisPanel {
  scheduler: IScheduler;
}

export interface IScheduler {}
