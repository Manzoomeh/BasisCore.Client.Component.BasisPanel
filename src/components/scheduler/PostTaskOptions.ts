import ITaskOptions, { IReportCallback, TaskType } from "./ITaskOptions";

export default class PostTaskOptions implements ITaskOptions {
  public container?: Element;
  public readonly title?: string;
  public readonly cancelable?: boolean = true;
  public readonly type?: TaskType = TaskType.progressive;
  public reportCallback?: IReportCallback;
  public readonly task: Promise<any>;
  public readonly notify?: boolean = true;
  private readonly _xhr: XMLHttpRequest;
  private _lastPercent: number;

  constructor(form: FormData, url: string, title: string) {
    this.title = title;
    this._xhr = new XMLHttpRequest();
    this.task = new Promise<boolean>((resolve, reject) => {
      this._xhr.open("POST", url);
      this._xhr.upload.addEventListener("progress", (e) => {
        let { loaded, total } = e;
        this._lastPercent = Math.floor((loaded / total) * 100);
        if (this.reportCallback) {
          this.reportCallback({ percent: this._lastPercent, title });
        }
      });
      //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/load_event
      this._xhr.addEventListener("load", (_) => resolve(true));
      //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout_event
      this._xhr.addEventListener("timeout", (e) => {
        this.reportCallback({
          percent: this._lastPercent,
          title: title,
          error: "Timeout",
        });
        reject(e);
      });
      //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/error_event
      this._xhr.addEventListener("error", (e) => {
        this.reportCallback({
          percent: this._lastPercent,
          title: title,
          error: "error",
        });
        reject(e);
      });
      //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort_event
      this._xhr.addEventListener("abort", (e) => {
        this.reportCallback({
          percent: this._lastPercent,
          title: title,
          cancel: true,
        });
        reject(e);
      });
      this._xhr.send(form);
    });
  }

  public cancel() {
    if (this._xhr.LOADING) {
      this._xhr.abort();
    }
  }
}
