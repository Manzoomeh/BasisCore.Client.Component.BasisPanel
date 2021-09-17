export default interface IDisposable {
  disposeAsync(): Promise<void>;
  disposed: boolean;
}
