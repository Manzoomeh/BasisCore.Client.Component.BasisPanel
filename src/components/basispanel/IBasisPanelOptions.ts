import ILogoutOptions from "../logout/ILogoutOptions";
import ICartOptions from "../cart/ICartOptions";
import IStoreOptions from "../store/IStoreOptions";
import { INotificationOptions } from "../notification/options/INotificationOptions";

export default interface IBasisPanelOptions {
  rKey: string;
  avatar: string;
  logo: string;
  baseUrl: IPanelPartUrlOptions;
  themeUrl: IUrlTheme;
  dataUrl: IUrlCollectionOption;
  widgetListUrl: string;
  addWidgetUrl: string;
  method: IPanelPartMethodOptions;
  checkRkey: ICheckRkeyOptions;
  culture: ICultureOptions;
  logout: ILogoutOptions;
  cart: ICartOptions;
  store: IStoreOptions;
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
export interface ICultureOptions {
  direction: IDirection;
  deviceId: number | string;
  labels: ILabels;
}

export type IDirection =  "leftToRight" | "rightToLeft";

export interface ILabels {
  userTitle: string;
  logoutTitle: string;
  corporateTitle: string;
  corporateSearchPlaceholder: string;
  corporateBuy: string;
  businessTitle: string;
  businessSearchPlaceholder: string;
  schedulerNoTask: string;
  schedulerCountTask: string;
  addToDashboardTooltip: string;
  dragAndDropMessage: string;
  widgetsTitle: string;
  widgetsTab: string;
  dashboardWidgetsTab: string;
  widgetsSettingButton: string;
  storeTitle: string;
  lightModeTitle: string;
  darkModeTitle: string;
}

