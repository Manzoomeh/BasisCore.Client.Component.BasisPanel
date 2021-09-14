export default interface IBasisPanelOptions {
  rKey: string;
  baseUrl: IPanelPartUrlOptions;
  dataUrl: IUrlCollectionOption;
  method: IPanelPartMethodOptions;
}

interface IUrlCollectionOption {
  user: string;
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
}
