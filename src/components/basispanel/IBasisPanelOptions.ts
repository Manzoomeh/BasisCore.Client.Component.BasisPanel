import ILogoutOptions from "../logout/ILogoutOptions";
import { INotificationOptions } from "../notification/options/INotificationOptions";

export default interface IBasisPanelOptions {
  rKey: string;
  avatar: string;
  baseUrl: IPanelPartUrlOptions;
  themeUrl: IUrlTheme;
  dataUrl: IUrlCollectionOption;
  widgetListUrl: string;
  addWidgetUrl: string;
  method: IPanelPartMethodOptions;
  checkRkey: ICheckRkeyOptions;
  logout: ILogoutOptions;
  notification: INotificationOptions;
  addtoDashboard: string;
  removeFromDashbaord: string;
  tempwidgets: string;
}

interface IUrlCollectionOption {
  profile: string;
  corporate: string;
  business: string;
}

interface IUrlTheme {
  light: string;
  dark: string;
  addThemeUrl: string;
  defaultTheme: string;
}
interface IPanelPartUrlOptions extends IUrlCollectionOption {
  active: string;
}

interface IPanelPartMethodOptions {
  userImage: string;
  userNoImage: string;
  userNoName: string;
  menu: string;
  page: string;
  sidebarMenu: string;
  widget: string;
}

export interface ICheckRkeyOptions {
  url?: string;
  cookieName?: string;
  defaultRedirectUrl: string;
}
