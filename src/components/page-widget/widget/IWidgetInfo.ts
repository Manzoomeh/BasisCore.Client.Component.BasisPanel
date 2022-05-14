export type ContainerTypes = "widget" | "sidebar" | "fullPageWidget";
export default interface IWidgetInfo {
  id: number;
  name: string;
  title: string;
  container: ContainerTypes;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  addToDashboard?: boolean;
}
