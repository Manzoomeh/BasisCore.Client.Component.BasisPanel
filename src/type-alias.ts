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
  static readonly THEME_CHANGE = "basispanel.theme_change";
}

export interface IDictionary<TValue> {
  [Key: string]: TValue;
}

export type PanelLevels = "corporate" | "business" | "profile";
export type PageId = number | "default";

export interface ILoaderParam {
  level: PanelLevels;
  //owner: MenuOwnerType;
  ownerId: number;
  ownerUrl: string;
  //rKey: string;
}

export interface IResponseCheckRkey {
  checked: boolean;
}

// export interface IModuleInfo {
//   owner: MenuOwnerType;
//   ownerUrl: string;
// }
export interface IModuleInfo {
  name: string;
  url: string;
  title: string;
}

export type menuItemClickCallback = (
  level: PanelLevels,
  ownerId: number,
  moduleId: number,
  pageId: number,
  target: EventTarget
) => void;
