export default class HttpUtil {
  static async getDataAsync<T>(url: string): Promise<T> {
    const result = await fetch(url, { method: "get" });
    return await result.json();
  }
}
