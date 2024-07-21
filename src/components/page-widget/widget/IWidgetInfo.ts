export type ContainerTypes = "widget" | "sidebar" | "fullPageWidget" | "externalWidget";
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
  sidebar: boolean;
  moduleid: number
  addToDashboard?: boolean;
  icon?: string;
  isPrimary?: boolean

}
