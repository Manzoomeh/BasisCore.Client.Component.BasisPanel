import { IDictionary } from "./type-alias";
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
    if (result.ok) {
      try {
        return await result.json();
      } catch (ex) {
        console.error(`Error in parse json result from ${url}`, ex);
        throw ex;
      }
    } else {
      throw result;
    }
  }

  static async checkRKeyFetchDataAsync<T>(
    url: string,
    method: "POST" | "GET",
    options: ICheckRkeyOptions,
    data?: any
  ): Promise<T> {
    // isAuthenticate
    try {
      return await HttpUtil.fetchDataAsync<T>(url, method, data);
    } catch (ex) {
      const status = ex.status;
      if (status == 401) {
        // Invalid rKey
        if (options.cookieName && options.cookieName != "") {
          const cookies = document.cookie.split(";");
          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim().split("=")[0];
            if (cookie == options.cookieName) {
              document.cookie =
                cookie + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              break;
            }
          }
        }
        window.location.href = options.defaultRedirectUrl;
      } else {
        console.error(`Error in parse json result from ${url}`, ex);
      }
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

  static getQueryStringObject(): object {
    let retVal = null;
    if (window.location.search) {
      const search = location.search.substring(1);
      retVal = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
    }
    return retVal;
  }
}
