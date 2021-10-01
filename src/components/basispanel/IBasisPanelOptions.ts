import { INotificationOptions } from "../notification/options/INotificationOptions";

export default interface IBasisPanelOptions {
  rKey: string;
  baseUrl: IPanelPartUrlOptions;
  dataUrl: IUrlCollectionOption;
  method: IPanelPartMethodOptions;
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
  widget: string;
}
