import ILogoutOptions from "../logout/ILogoutOptions";
import { INotificationOptions } from "../notification/options/INotificationOptions";

export default interface IBasisPanelOptions {
  rKey: string;
  avatar: string ;
  baseUrl: IPanelPartUrlOptions;
  dataUrl: IUrlCollectionOption;
  method: IPanelPartMethodOptions;
  logout: ILogoutOptions;
  notification: INotificationOptions;
}

interface IUrlCollectionOption {
  profile: string;
  corporate: string;
  business: string;
}
interface IPanelPartUrlOptions extends IUrlCollectionOption {
  active: string;
}

interface IPanelPartMethodOptions {
  userImage: string;
  menu: string;
  page: string;
  sidebarMenu: string;
  widget: string;
}
