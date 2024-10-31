import IProfileInfo from "./IProfileInfo";

export default interface IProfileAccessor {
  getCurrent(): IProfileInfo;
}
