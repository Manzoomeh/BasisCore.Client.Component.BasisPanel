import { IDictionary, IResponseCheckRkey } from "./type-alias";
import { ICheckRkeyOptions } from "./components/basispanel/IBasisPanelOptions";

export default class HttpUtil {
  static async fetchStringAsync(
    url: string,
    method: "POST" | "GET",
    data?: any
  ): Promise<string> {
    const init: RequestInit = { method: method };
    if (data) {
      init.headers = {
        "Content-Type": "application/json",
      };
      init.body = JSON.stringify(data);
    }
    const result = await fetch(url, init);
    return await result.text();
  }

  static async fetchDataAsync<T>(
    url: string,
    method: "POST" | "GET",
    data?: any
  ): Promise<T> {
    const init: RequestInit = { method: method };
    if (data) {
      init.headers = {
        "Content-Type": "application/json",
      };
      init.body = JSON.stringify(data);
    }
    const result = await fetch(url, init);
    try {
      return await result.json();
    } catch (ex) {
      console.error(`Error in parse json result from ${url}`, ex);
      throw ex;
    }
  }

  static async sendFormData<T>(
    url: string,
    method: "POST" | "GET",
    data?: any
  ): Promise<T> {
    const init: RequestInit = { method: method };
    if (data) {
      init.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      init.body = data;
    }
    const result = await fetch(url, init);
    try {
      return await result.json();
    } catch (ex) {
      console.error(`Error in parse json result from ${url}`, ex);
      throw ex;
    }
  }

  static formatString(
    string: string,
    params: IDictionary<string> | any
  ): string {
    const paraNameList = [...Object.getOwnPropertyNames(params)];
    const formatter = new Function(...paraNameList, `return \`${string}\``);
    return formatter(...paraNameList.map((x) => Reflect.get(params, x)));
  }

  public static async isAuthenticate(
    rKey: string,
    options: ICheckRkeyOptions,
  ): Promise<boolean> {
    const url = HttpUtil.formatString(options.url, {
      rKey: rKey,
    });
    const result = await HttpUtil.sendFormData<IResponseCheckRkey>(
      url,
      "GET"
    );
    return result.checked;
  }

}