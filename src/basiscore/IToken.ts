export default interface IToken<T> {
  getValueAsync(wait?: boolean): Promise<T>;
  getSourceNames(): Array<string>;
  getDefault(): T;
}
