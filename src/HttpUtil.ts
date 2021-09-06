import IProfileInfo from "./components/accounting/IProfileInfo";
import { IDictionary } from "./type-alias";

export default class HttpUtil {
  static getDataAsync<T>(url: string): Promise<T> {
    return HttpUtil.fetchDataAsync(url, "GET");
  }
  static async fetchDataAsync<T>(
    url: string,
    method: "POST" | "GET"
  ): Promise<T> {
    const result = await fetch(url, { method: method });
    return await result.json();
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
}
