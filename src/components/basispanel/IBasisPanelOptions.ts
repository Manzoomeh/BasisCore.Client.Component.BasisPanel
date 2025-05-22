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
  addWidgetUrl: string;
  bannerUrl: string;
  method: IPanelPartMethodOptions;
  dashboardCustomizeMethod: IPanelPartDashboardOptions;
  checkRkey: ICheckRkeyOptions;
  culture: ICultureOptions;
  logout: ILogoutOptions;
  cart: ICartOptions;
  store: IStoreOptions;
  notification: INotificationOptions;
  serviceLink?: string;
  businessLink?: string;
  urlPrefix?: string;
  lid?: string;
  announceURL: string;
  search?: ISearchOptions[]
}
interface IPanelPartDashboardOptions {
  removeDashboardReservedWidgets: string;
  addtoDashboardReservedWidget: string;
  dashboardReservedWidgets: string;
}
export interface IUrlCollectionOption {
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
  pageCustomize: string;
  sidebarMenu: string;
  reservedWidgets: string;

  widget: string;
  errorMessages: string;
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
  generalErrorMessages: string;
}

export type IDirection = "leftToRight" | "rightToLeft";

export interface ILabels {
  userTitle: string;
  logoutTitle: string;
  logoutBtn: string;
  logoutMessage: string;
  cancelBtn: string;
  corporateTitle: string;
  corporateSearchPlaceholder: string;
  corporateBuy: string;
  businessBuy: string;
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
  widgetsHeaderTitle: string;
}

export  interface ISearchOptions {
  title: string;
  icon:  string;
  module:{
    id : number
    name : string, 
    url : string
  },
  api: string;
  method : "post" | "get";
  body : object
  pageid: number,
  level : string,
  outputKey: string,
  type : "json" | "formData"
}
