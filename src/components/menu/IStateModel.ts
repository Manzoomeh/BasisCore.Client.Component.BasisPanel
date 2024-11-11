import { PageId, PanelLevels } from "../../type-alias";

export default interface IStateModel {
  level: PanelLevels;
  levelId: number;
  businessId?: number;
  corporateId?: number;
  moduleId?: number;
  pageId: PageId;
  arguments?: any;
}
