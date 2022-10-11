import { IComponentManager, ISource, IUserDefineComponent } from "basiscore";
import IBasisPanelOptions, { ICultureOptions, IDirection, ILabels } from "./basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent
  implements IComponentManager
{
  protected readonly owner: IUserDefineComponent;
  public readonly container: Element;
  protected readonly options: IBasisPanelOptions;
  protected readonly direction: IDirection;
  protected readonly labels: ILabels;
  static _cultureDefaults: Partial<ICultureOptions>;
  static getDefaultCultures(): Partial<ICultureOptions> {
    if (!BasisPanelChildComponent._cultureDefaults) {
      BasisPanelChildComponent._cultureDefaults = {
        direction: "rightToLeft",
        labels: {
          userTitle: "نام کاربری",
          logoutTitle: "خارج شدن",
          corporateTitle: "شرکت‌ها",
          corporateSearchPlaceholder: "جستجوی شرکت ...",
          corporateBuy: "خرید سرویس",
          businessTitle: "کسب‌و‌کارها",
          businessSearchPlaceholder: "جستجوی کسب‌و‌کار ...",
          schedulerNoTask: "در انتظار کار جدید",
          addToDashboardTooltip: "افزودن به داشبورد",
          dragAndDropMessage: "ویجت‌ها را بکشید و رها کنید",
          widgetsTitle: "ویجت‌ها",
          widgetsTab: "ویجت‌ها",
          dashboardWidgetsTab: "ویجت‌ میزکار",
          widgetsSettingButton: "ذخیره تغییرات"
        },
      };
    }
    return BasisPanelChildComponent._cultureDefaults;
  }

  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    this.owner = owner;
    this.container = document.createElement("div");
    this.container.setAttribute(dataAttr, "");
    this.owner.setContent(this.container);

    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );

    this.direction = this.options.culture?.direction ?? BasisPanelChildComponent.getDefaultCultures().direction;
    this.container.setAttribute("data-bc-bp-direction", this.direction);

    this.labels = {
      ...BasisPanelChildComponent.getDefaultCultures().labels,
      ...(this.options?.culture?.labels ?? {}),
    };

    if (layout?.length > 0) {
      const copyLayout = layout
        .replace("@userTitle", this.labels.userTitle)
        .replace("@logoutTitle", this.labels.logoutTitle)
        .replace("@corporateTitle", this.labels.corporateTitle)
        // .replace("@corporateSearchPlaceholder", this.labels.corporateSearchPlaceholder)
        .replace("@corporateBuy", this.labels.corporateBuy)
        .replace("@businessTitle", this.labels.businessTitle)
        // .replace("@businessSearchPlaceholder", this.labels.businessSearchPlaceholder)
        .replace("@schedulerNoTask", this.labels.schedulerNoTask)
        .replace("@addToDashboardTooltip", this.labels.addToDashboardTooltip)
        // .replace("@dragAndDropMessage", this.labels.dragAndDropMessage)
        .replace("@widgetsTitle", this.labels.widgetsTitle)
        .replace("@widgetsTab", this.labels.widgetsTab)
        .replace("@dashboardWidgetsTab", this.labels.dashboardWidgetsTab)
        .replace("@widgetsSettingButton", this.labels.widgetsSettingButton);

      const range = new Range();
      range.setStart(this.container, 0);
      range.setEnd(this.container, 0);
      range.insertNode(range.createContextualFragment(copyLayout));
    }
  }
  public abstract initializeAsync(): Promise<void>;
  public abstract runAsync(source?: ISource): any | Promise<any>;
}
