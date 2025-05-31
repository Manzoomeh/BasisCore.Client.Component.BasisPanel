import { PageId, PanelLevels } from "../../type-alias";

export default interface IStateModel {
  level: PanelLevels;
  businessId?: number;
  corporateId?: number;
  moduleId?: number;
  pageId: PageId;
  arguments?: any;
  menuPageId?: PageId;
}
