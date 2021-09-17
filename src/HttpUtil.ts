import IProfileInfo from "./components/profile/IProfileInfo";
import { IDictionary } from "./type-alias";

export default class HttpUtil {
  static getDataAsync<T>(url: string): Promise<T> {
    return HttpUtil.fetchDataAsync(url, "GET");
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
    return await result.json();
  }

  static async fetchStringAsync(
    url: string,
    method: "POST" | "GET"
  ): Promise<string> {
    const init: RequestInit = { method: method };
    const result = await fetch(url, init);
    return await result.text();
  }
  static async formatAndGetDataAsync<T>(
    url: string,
    rKey: string,
    profile: IProfileInfo,
    extra?: IDictionary<string>
  ): Promise<T> {
    let retVal: Promise<T>;
    if (!extra) {
      const formatter = new Function("rKey", "profile", `return \`${url}\``);
      retVal = HttpUtil.getDataAsync<T>(formatter(rKey, profile));
    } else {
      const params = ["rKey", "profile", ...Object.getOwnPropertyNames(extra)];
      const formatter = new Function(...params, `return \`${url}\``);
      retVal = HttpUtil.getDataAsync<T>(
        formatter(
          rKey,
          profile,
          ...Object.getOwnPropertyNames(extra).map((x) => Reflect.get(extra, x))
        )
      );
    }

    return retVal;
  }

  static formatString(
    string: string,
    params: IDictionary<string> | any
  ): string {
    const paraNameList = [...Object.getOwnPropertyNames(params)];
    const formatter = new Function(...paraNameList, `return \`${string}\``);
    return formatter(...paraNameList.map((x) => Reflect.get(params, x)));
  }
}
