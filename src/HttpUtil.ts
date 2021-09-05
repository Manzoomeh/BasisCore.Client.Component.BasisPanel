import IProfileInfo from "./components/accounting/IProfileInfo";

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
    profile: IProfileInfo
  ): Promise<T> {
    const formatter = new Function("rKey", "profile", `return \`${url}\``);
    return HttpUtil.getDataAsync<T>(formatter(rKey, profile));
  }
}
