import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import HttpUtil from "../../../HttpUtil";
import { IUserDefineComponent } from "basiscore";
import { ISource } from "basiscore";
import PageWidgetComponent from "../PageWidgetComponent";
import IPage from "../../page/IPage";
import NotificationMessageComponent from "../../notificationMessage/NotificationMessageComponent";
import WidgetListComponent from "../../widget-list/WidgetListComponent";
import MenuComponent from "../../menu/MenuComponent";
import PageComponent from "../../page/PageComponent";
import LocalStorageUtil from "../../../LocalStorageUtil";

export default class WidgetComponent extends PageWidgetComponent {
  pageLoader: MenuComponent;
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-widget-container");
    this.pageLoader = this.owner.dc.resolve<MenuComponent>("page_loader");
  }
  public async loadContentAsync(): Promise<string> {
    // const baseUrl = this.pageLoader.moduleMapper
    //   .get(this.pageLoader.current.param.owner)
    //   //@ts-ignore
    //   ?.get(Number(this.param.moduleid))?.ownerUrl;

    const baseUrl = this.pageLoader.getModuleInfo(
      this.param.page.level,
      this.param.page.levelId,
      this.param.page.moduleId
    ).url;
    
    const url = HttpUtil.formatString(
      `${baseUrl ?? this.param.page.moduleUrl}${this.options.method.widget}`,
      { rKey: this.options.rKey, widgetId: this.param.id }
    );
    return await HttpUtil.fetchStringAsync(url, "GET");
  }
  public async initializeAsync(): Promise<void> {
    let topPosition = 0;
    const hasSidebar = this.owner.node.getAttribute("has-sidebar");
    if (hasSidebar == "true" && this.options.culture.deviceId == 2) {
      topPosition = 50;
    }

    this.container.setAttribute("data-bc-bp-widget-container-drag", "");
    this.container.setAttribute("id", String(this.param.id));
    const closeBtn = this.container.querySelector(
      "[data-bc-widget-btn-close]"
    ) as HTMLElement;
    // closeBtn.setAttribute("style", "display:none !important;z-index:10");
    if(closeBtn){
    closeBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.param.isBanner) {
        LocalStorageUtil.setClosedBanners(this.param.id);
        const page = this.owner.dc.resolve("page") as any;

        page.container
          .querySelectorAll('[data-bc-bp-group-container="d1"]')
          .forEach((element) => {
            element.remove();
          });
        page.initializeAsync();
        page.info.groups.map((g, i) => {
          page.info.groups[i].widgets = page.info.groups[i].widgets.filter(
            (w) => {
              return w.id != this.param.id;
            }
          );
        });
        page.groups = JSON.parse(JSON.stringify(page.info));
        page.addingPageGroupsAsync(page.groups);
      } else {
        const disableWidgets = document.querySelector(
          "[data-bc-page-widget-disableList]"
        );
        try {
          this.removeAsync();

          const widgetList =
            this.owner.dc.resolve<WidgetListComponent>("widgetList");
          if (this.param.isPrimary) {
            widgetList.disabledWidgetList.push({
              widgetid: this.param.id,
              name: this.param.name,
              title: this.param.title,
              icon: this.param.icon
                ? this.param.icon
                : `data:image/svg+xml,%3Csvg%20width%3D%22116%22%20height%3D%2270%22%20viewBox%3D%220%200%20116%2070%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3Cmask%20id%3D%22mask0_12273_103335%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22116%22%20height%3D%2270%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3C%2Fmask%3E%0A%3Cg%20mask%3D%22url%28%23mask0_12273_103335%29%22%3E%0A%3Cpath%20d%3D%22M112.749%2026.3801L121.932%2040.721L107.591%2049.9042L98.4076%2035.5633L112.749%2026.3801ZM79.9424%2021.3886L76.2583%2038.1915L59.4553%2034.5074L63.1394%2017.7045L79.9424%2021.3886ZM112.739%2072.6062L109.055%2089.4091L92.2524%2085.725L95.9365%2068.9221L112.739%2072.6062ZM115.327%2014.618L86.2255%2032.8923L104.92%2062.0863L89.3771%2058.6786L82.0089%2092.2844L115.615%2099.6526L122.983%2066.0468L104.92%2062.0863L133.694%2043.2999L115.327%2014.618ZM90.1859%2014.8292L56.58%207.46096L49.2118%2041.0668L82.8177%2048.435L90.1859%2014.8292ZM70.7321%2063.3959L67.048%2080.1989L50.2451%2076.5148L53.9292%2059.7118L70.7321%2063.3959ZM80.9756%2056.8365L47.3698%2049.4683L40.0016%2083.0742L73.6074%2090.4424L80.9756%2056.8365Z%22%20fill%3D%22%23004B85%22%20fill-opacity%3D%220.15%22%2F%3E%0A%3Cpath%20d%3D%22M61.7%2027.8L64.5%2030.6L61.7%2033.4L58.9%2030.6L61.7%2027.8ZM54%2028.3V32.3H50V28.3H54ZM64%2038.3V42.3H60V38.3H64ZM61.7%2025L56%2030.6L61.7%2036.3H58V44.3H66V36.3H61.7L67.3%2030.6L61.7%2025ZM56%2026.3H48V34.3H56V26.3ZM54%2038.3V42.3H50V38.3H54ZM56%2036.3H48V44.3H56V36.3Z%22%20fill%3D%22%23004B85%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A`,
              w: this.param.w,
              h: this.param.h,
            });
            widgetList.fillListUI();
          } else {
            widgetList.disabledDashboardWidgetList.push({
              widgetid: this.param.id,
              title: this.param.title,
              icon: this.param.icon
                ? this.param.icon
                : `data:image/svg+xml,%3Csvg%20width%3D%22116%22%20height%3D%2270%22%20viewBox%3D%220%200%20116%2070%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3Cmask%20id%3D%22mask0_12273_103335%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22116%22%20height%3D%2270%22%3E%0A%3Crect%20width%3D%22116%22%20height%3D%2270%22%20rx%3D%225%22%20fill%3D%22%23E4E7F4%22%2F%3E%0A%3C%2Fmask%3E%0A%3Cg%20mask%3D%22url%28%23mask0_12273_103335%29%22%3E%0A%3Cpath%20d%3D%22M112.749%2026.3801L121.932%2040.721L107.591%2049.9042L98.4076%2035.5633L112.749%2026.3801ZM79.9424%2021.3886L76.2583%2038.1915L59.4553%2034.5074L63.1394%2017.7045L79.9424%2021.3886ZM112.739%2072.6062L109.055%2089.4091L92.2524%2085.725L95.9365%2068.9221L112.739%2072.6062ZM115.327%2014.618L86.2255%2032.8923L104.92%2062.0863L89.3771%2058.6786L82.0089%2092.2844L115.615%2099.6526L122.983%2066.0468L104.92%2062.0863L133.694%2043.2999L115.327%2014.618ZM90.1859%2014.8292L56.58%207.46096L49.2118%2041.0668L82.8177%2048.435L90.1859%2014.8292ZM70.7321%2063.3959L67.048%2080.1989L50.2451%2076.5148L53.9292%2059.7118L70.7321%2063.3959ZM80.9756%2056.8365L47.3698%2049.4683L40.0016%2083.0742L73.6074%2090.4424L80.9756%2056.8365Z%22%20fill%3D%22%23004B85%22%20fill-opacity%3D%220.15%22%2F%3E%0A%3Cpath%20d%3D%22M61.7%2027.8L64.5%2030.6L61.7%2033.4L58.9%2030.6L61.7%2027.8ZM54%2028.3V32.3H50V28.3H54ZM64%2038.3V42.3H60V38.3H64ZM61.7%2025L56%2030.6L61.7%2036.3H58V44.3H66V36.3H61.7L67.3%2030.6L61.7%2025ZM56%2026.3H48V34.3H56V26.3ZM54%2038.3V42.3H50V38.3H54ZM56%2036.3H48V44.3H56V36.3Z%22%20fill%3D%22%23004B85%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A`,
              moduleid: this.param.moduleid,
            });
            widgetList.fillDashboardWidgetList();
          }
        } catch (e) {
          console.log("error :>> ", e);
        }
      }
    });
  }
    if (!this.param.isBanner && closeBtn) {
      closeBtn.setAttribute("style", "display:none !important");
    }
    this.container.setAttribute("gs-x", this.param.x.toString());
    this.container.setAttribute("gs-y", this.param.y.toString());
    this.container.setAttribute("gs-w", this.param.w.toString());
    this.container.setAttribute("gs-h", this.param.h.toString());
    const page = this.owner.dc.resolve<PageComponent>("page");
    const parent = document.querySelector("[data-bc-page-body]") as HTMLElement;
    let cell;
    if (page.widgetCell == null) {
      page.widgetCell = parent.offsetWidth / 12;
      cell = parent.offsetWidth / 12;
    } else {
      cell = page.widgetCell;
    }
    (this.container as HTMLElement).style.height = `${this.param.h * cell}px`;

    (this.container as HTMLElement).style.top = `${
      this.param.y * cell + (parent.clientTop + topPosition)
    }px`;

    // (this.container as HTMLElement).style.left = `${this.param.x * cell}px`;

    // if (this.deviceId == 2) {
    //   const uniqueName = `widget${this.param.id.toString()}`;
    //   this.container.setAttribute("id", uniqueName);
    //   const li = document.createElement("li");
    //   li.setAttribute("data-bc-page-widgets-list-move-ico", "");
    //   li.setAttribute("data-widget", uniqueName);
    //   li.addEventListener("click", function (e) {
    //     document.getElementById(uniqueName).scrollIntoView(true);
    //   });
    //   const span = document.createElement("span");
    //   span.textContent = `${this.param.id.toString()}`;
    //   li.appendChild(span);
    //   this.container.closest("[data-bc-bp-page-container]").querySelector("[data-bc-page-widgets-list-toggle]").appendChild(li);
    // }

    // this.title = this.param.title;

    const container = this.container.querySelector(
      "[data-bc-widget-body-container]"
    );
    const processTask = new Promise<void>(async (resolve, reject) => {
      try {
        var content = await this.loadContentAsync();
        const range = new Range();
        range.setStart(container, 0);
        range.setEnd(container, 0);
        const newContent = range.createContextualFragment(content);
        const nodes = Array.from(newContent.childNodes);
        range.insertNode(newContent);
        this.owner.processNodesAsync(nodes);
        // this.container
        //   .querySelectorAll("[data-bc-widget-btn-close]")
        //   .forEach((btn) =>
        //     btn.addEventListener("click", (e) => {
        //       e.preventDefault();
        //       this.removeAsync();
        //     })
        //   );
        const page = this.owner.dc.resolve<IPage>("page");

        if (
          (this.param.addToDashboard == null ||
            this.param.addToDashboard == true) &&
          page?.info?.container !== "dashboard"
        ) {
          this.container
            .querySelectorAll("[data-bc-widget-btn-add-dashboard]")
            .forEach((btn) => {
              const currentAddToDashboardBtn = btn as HTMLElement;
              currentAddToDashboardBtn.style.display = "inline-block";
              btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.addToDashboard();
              });
            });
        } else {
          this.container
            .querySelectorAll("[data-bc-widget-btn-add-dashboard]")
            .forEach((btn) => {
              const currentAddToDashboardBtn = btn as HTMLElement;
              currentAddToDashboardBtn.setAttribute(
                "style",
                "display: none !important"
              );
            });
        }

        resolve();
      } catch (e) {
        reject(e);
      }
    });
    // const taskOptions: ITaskOptions = {
    //   container: container,
    //   task: processTask,
    //   notify: false,
    // };
    // this.owner.dc.resolve<IScheduler>("scheduler").startTask(taskOptions);
  }

  public runAsync(source?: ISource) {
    return true;
  }

  private async removeAsync(): Promise<void> {
    try {
      await this.owner.disposeAsync();
    } catch (e) {
      console.log("error :>> ", e);
    }
    this.container.remove();
    // this.owner.setSource(DefaultSource.WIDGET_CLOSED, this.param);
  }

  private async addToDashboard(): Promise<void> {
    const widgetTitle = this.owner.dc.resolve<any>("widget");
    const widgetId = this.param.id;
    const mid = LocalStorageUtil.moduleId;
    const apiInputs = {
      widgetid: widgetId,
      title: widgetTitle.title,
      moduleid: mid || this.param.moduleid,
    };
    const url = HttpUtil.formatString(
      this.options.baseUrl[this.pageLoader.current.level] +
        this.options.dashboardCustomizeMethod.addtoDashboardReservedWidget,
      {
        rKey: this.options.rKey,
      }
    );
    let res: any = await HttpUtil.fetchStringAsync(url, "POST", apiInputs);
    res = JSON.parse(res);
    const message =
      this.owner.dc.resolve<NotificationMessageComponent>("message");
    message.NotificationMessageMethod(
      res.errorid,
      Number(this.options.lid) || 1
    );
  }
}
