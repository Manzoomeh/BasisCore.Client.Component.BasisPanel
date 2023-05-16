export default interface IPageLoader {
  tryLoadPage(pageId: string, args?: any): boolean;
}
