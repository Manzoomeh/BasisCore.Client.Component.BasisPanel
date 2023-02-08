import { IComponentManager, ISource, IUserDefineComponent } from "basiscore";
import IBasisPanelOptions, { ICultureOptions, IDirection, ILabels } from "./basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent
  implements IComponentManager
{
  protected readonly owner: IUserDefineComponent;
  public readonly container: Element;
  protected readonly options: IBasisPanelOptions;
  protected readonly direction: IDirection;
  // protected readonly deviceId: number | string;
  public readonly deviceId: number | string;
  protected readonly labels: ILabels;
  static _cultureDefaults: Partial<ICultureOptions>;
  static getDefaultCultures(): Partial<ICultureOptions> {
    if (!BasisPanelChildComponent._cultureDefaults) {
      BasisPanelChildComponent._cultureDefaults = {
        direction: "rightToLeft",
        deviceId: 1,
        labels: {
          userTitle: "نام کاربری",
          logoutTitle: "خارج شدن",
          corporateTitle: "شرکت‌ها",
          corporateSearchPlaceholder: "جستجوی شرکت ...",
          corporateBuy: "خرید سرویس",
          businessTitle: "کسب‌و‌کارها",
          businessSearchPlaceholder: "جستجوی کسب‌و‌کار ...",
          schedulerNoTask: "در انتظار کار جدید",
          schedulerCountTask: "مورد آپلود",
          addToDashboardTooltip: "افزودن به داشبورد",
          dragAndDropMessage: "ویجت‌ها را بکشید و رها کنید",
          widgetsTitle: "ویجت‌ها",
          widgetsTab: "ویجت‌ها",
          dashboardWidgetsTab: "ویجت‌ میزکار",
          widgetsSettingButton: "ذخیره تغییرات",
          storeTitle:"فروشگاه",
          lightModeTitle: "روز",
          darkModeTitle: "شب"
        },
      };
    }
    return BasisPanelChildComponent._cultureDefaults;
  }

  constructor(owner: IUserDefineComponent, desktopLayout: string, mobileLayout: string, dataAttr: string) {
    this.owner = owner;
    this.container = document.createElement("div");
    this.owner.setContent(this.container);

    this.options = this.owner.getSetting<IBasisPanelOptions>(
      "basispanel.option",
      null
    );

    // initialize direction
    this.direction = this.options.culture?.direction ?? BasisPanelChildComponent.getDefaultCultures().direction;
    this.container.setAttribute("data-bc-bp-direction", this.direction);

    // initialize deviceId
    const optionDeviceId = this.options.culture?.deviceId;
    if (optionDeviceId) {
      if (typeof optionDeviceId == "string") {
        const devicesList = require("../devicesList.json");
        const deviceId = devicesList.find(ex => ex.title.toLowerCase() === optionDeviceId.toString().toLowerCase());
        this.deviceId = deviceId?.deviceId ?? BasisPanelChildComponent.getDefaultCultures().deviceId;
      } else if (typeof optionDeviceId == "number") {
        const devicesList = require("../devicesList.json");
        const deviceId = devicesList.find(ex => ex.deviceId === optionDeviceId);
        this.deviceId = deviceId?.deviceId ?? BasisPanelChildComponent.getDefaultCultures().deviceId;
      }
    } else {
      this.deviceId = BasisPanelChildComponent.getDefaultCultures().deviceId;
    }

    // initialize labels
    this.labels = {
      ...BasisPanelChildComponent.getDefaultCultures().labels,
      ...(this.options?.culture?.labels ?? {}),
    };

    this.container.setAttribute(dataAttr, `d${this.deviceId}`);

    let layout;
    switch(this.deviceId) {
      case 1:
        layout = desktopLayout;
        break;
      case 2:
        layout = mobileLayout;
        break;
      default:
        // code block
    }

    if (layout?.length > 0) {
      const copyLayout = layout
        .replace("@userTitle", this.labels.userTitle)
        .replace("@logoutTitle", this.labels.logoutTitle)
        .replace("@corporateTitle", this.labels.corporateTitle)
        .replace("@corporateDropDownTitle", this.labels.corporateTitle)
        // .replace("@corporateSearchPlaceholder", this.labels.corporateSearchPlaceholder)
        .replace("@corporateBuy", this.labels.corporateBuy)
        .replace("@businessTitle", this.labels.businessTitle)
        .replace("@businessDropDownTitle", this.labels.businessTitle)
        // .replace("@businessSearchPlaceholder", this.labels.businessSearchPlaceholder)
        .replace("@schedulerNoTask", this.labels.schedulerNoTask)
        .replace("@schedulerCountTask", this.labels.schedulerCountTask)
        .replace("@addToDashboardTooltip", this.labels.addToDashboardTooltip)
        // .replace("@dragAndDropMessage", this.labels.dragAndDropMessage)
        .replace("@widgetsTitle", this.labels.widgetsTitle)
        .replace("@widgetsTab", this.labels.widgetsTab)
        .replace("@dashboardWidgetsTab", this.labels.dashboardWidgetsTab)
        .replace("@widgetsSettingButton", this.labels.widgetsSettingButton)
        .replace("@storeTitle", this.labels.storeTitle)
        .replace("@lightModeTitle", this.labels.lightModeTitle)
        .replace("@darkModeTitle", this.labels.darkModeTitle);

      const range = new Range();
      range.setStart(this.container, 0);
      range.setEnd(this.container, 0);
      range.insertNode(range.createContextualFragment(copyLayout));
    }
  }
  public abstract initializeAsync(): Promise<void>;
  public abstract runAsync(source?: ISource): any | Promise<any>;
}
