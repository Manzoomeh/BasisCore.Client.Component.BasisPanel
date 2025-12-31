import { ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import mobileLayout from "./assets/layout-mobile.html";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import "./assets/style.css";

import HttpUtil from "../../HttpUtil";
import INotificationComponent from "./INotificationComponent";
import {
  INotificationDetailsResponse,
  INotificationGetDetailsRequest,
  INotificationGetListRequest,
  INotificationItem,
  INotificationListResponse,
  INotificationPushResponse,
  INotificationSeenResponse,
  NotificationType,
} from "./INotificationItem";
import { INotificationOptions } from "./INotificationOptions";
import { NotificationModal } from "./NotificationModal";

export default class NotificationComponent
  extends BasisPanelChildComponent
  implements INotificationComponent
{
  private notifications: INotificationItem[] = [];
  private websocket: WebSocket | null = null;
  private websocketUrl: string;
  private reconnectInterval: number;
  private autoReconnect: boolean;
  private reconnectTimer: number | null = null;
  private isManualClose: boolean = false;
  private currentTab: "all" | NotificationType = "all";
  private tabButtons: Map<string, HTMLElement> = new Map();
  private isInitialized: boolean = false;
  private messageQueue: any[] = []; // صف پیام‌های در انتظار ارسال
  private modal: NotificationModal | null = null;

  constructor(owner: IUserDefineComponent) {
    super(
      owner,
      desktopLayout,
      mobileLayout,
      "data-bc-bp-notification-container"
    );

    const options = this.options.notification as INotificationOptions;

    if (!options || !options.websocketUrl) {
      console.error("WebSocket URL is required in notification options");
      throw new Error("WebSocket URL is required");
    }

    this.websocketUrl = HttpUtil.formatString(options.websocketUrl, {
      rKey: this.options.rKey,
    });
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.autoReconnect = options.autoReconnect !== false; // پیش‌فرض true

    this.container.setAttribute("data-count", "0");
  }

  public async initializeAsync(): Promise<void> {
    // ایجاد تب‌ها
    this.createTabs();

    // افزودن event listener برای دکمه نوتیفیکیشن
    this.setupNotificationToggle();

    // ایجاد modal برای نمایش جزئیات
    this.modal = new NotificationModal(
      this.container as HTMLElement,
      (notificationId) => this.requestNotificationDetails(notificationId)
    );

    // اتصال به WebSocket
    this.connectWebSocket();

    this.isInitialized = true;
  }

  private connectWebSocket(): void {
    try {
      // بستن اتصال قبلی در صورت وجود
      if (this.websocket) {
        this.websocket.close();
      }

      console.log(`Connecting to WebSocket: ${this.websocketUrl}`);
      this.websocket = new WebSocket(this.websocketUrl);

      // رویداد باز شدن اتصال
      this.websocket.onopen = () => {
        console.log("WebSocket connected successfully");
        this.onWebSocketOpen();
      };

      // رویداد دریافت پیام
      this.websocket.onmessage = (event) => {
        this.onWebSocketMessage(event);
      };

      // رویداد خطا
      this.websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.onWebSocketError(error);
      };

      // رویداد بسته شدن اتصال
      this.websocket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        this.onWebSocketClose(event);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.scheduleReconnect();
    }
  }

  private onWebSocketOpen(): void {
    // پاک کردن timer reconnect
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // ارسال پیام‌های در صف
    this.flushMessageQueue();

    // درخواست لیست نوتیفیکیشن‌ها
    this.requestNotificationList();
  }

  private onWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (data.action === "notification-list") {
        this.handleNotificationListResponse(data as INotificationListResponse);
      } else if (data.action === "notification-details") {
        this.handleNotificationDetailsResponse(
          data as INotificationDetailsResponse
        );
      } else if (data.action === "notification") {
        this.handleNotificationPush(data as INotificationPushResponse);
      } else if (data.action === "notification-seen") {
        this.handleNotificationSeenUpdate(data as INotificationSeenResponse);
      } else {
        console.warn("Unknown WebSocket message action:", data.action);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error, event.data);
    }
  }

  private onWebSocketError(error: Event): void {
    console.error("WebSocket encountered an error");
    // می‌تونی اینجا notification یا پیام خطا به کاربر نشون بدی
  }

  private onWebSocketClose(event: CloseEvent): void {
    this.websocket = null;

    // اگر بستن دستی نبوده و autoReconnect فعال باشه، reconnect کن
    if (!this.isManualClose && this.autoReconnect) {
      console.log(
        `WebSocket closed, will reconnect in ${this.reconnectInterval}ms`
      );
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = window.setTimeout(() => {
      console.log("Attempting to reconnect WebSocket...");
      this.connectWebSocket();
    }, this.reconnectInterval);
  }

  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    console.log(`Flushing ${this.messageQueue.length} queued messages`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendWebSocketMessage(message);
    }
  }

  private createTabs(): void {
    const tabsContainer = this.container.querySelector(
      "[data-bc-notification-tabs]"
    );
    if (!tabsContainer) return;

    // تب "همه"
    const allTab = this.createTabButton("همه", "all", true);
    tabsContainer.appendChild(allTab);
    this.tabButtons.set("all", allTab);

    // تب‌های مربوط به هر نوع
    const types = [
      { type: NotificationType.ERROR, label: "خطا" },
      { type: NotificationType.WARNING, label: "هشدار" },
      { type: NotificationType.NOTICE, label: "اطلاعیه" },
      { type: NotificationType.OTHER, label: "سایر" },
    ];

    types.forEach(({ type, label }) => {
      const tabButton = this.createTabButton(label, type.toString(), false);
      tabsContainer.appendChild(tabButton);
      this.tabButtons.set(type.toString(), tabButton);
    });

    // به‌روزرسانی شمارنده‌های تب‌ها
    this.updateTabCounts();
  }

  private createTabButton(
    label: string,
    tabId: string,
    isActive: boolean
  ): HTMLElement {
    const button = document.createElement("button");
    button.setAttribute("data-bc-notification-tab-button", "");
    button.setAttribute("data-tab-id", tabId);

    // ساخت ساختار تب با label و badge
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    button.appendChild(labelSpan);

    const badge = document.createElement("span");
    badge.setAttribute("data-bc-tab-count", "");
    badge.style.display = "none";
    button.appendChild(badge);

    if (isActive) {
      button.setAttribute("data-active", "true");
    }

    button.addEventListener("click", () => {
      this.switchTab(tabId);
    });

    return button;
  }

  private switchTab(tabId: string): void {
    // غیرفعال کردن همه تب‌ها
    this.tabButtons.forEach((btn) => {
      btn.removeAttribute("data-active");
    });

    // فعال کردن تب انتخاب شده
    const selectedButton = this.tabButtons.get(tabId);
    if (selectedButton) {
      selectedButton.setAttribute("data-active", "true");
    }

    // تنظیم تب فعلی
    this.currentTab =
      tabId === "all" ? "all" : (parseInt(tabId) as NotificationType);

    // به‌روزرسانی لیست
    this.renderNotifications();
  }

  private setupNotificationToggle(): void {
    const alertButton = this.container.querySelector(
      "[data-bc-notification-alert]"
    );
    const dropdown = this.container.querySelector(
      "[data-bc-notification-dropdown-wrapper]"
    );
    const closeButton = this.container.querySelector(
      "[data-bc-notification-dropdown-closed]"
    );

    if (alertButton && dropdown) {
      alertButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle("active");
      });
    }

    if (closeButton && dropdown) {
      closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.remove("active");
      });
    }

    // بستن با کلیک بیرون از dropdown
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (dropdown && !this.container.contains(target)) {
        dropdown.classList.remove("active");
      }
    });
  }

  private requestNotificationList(): void {
    const request: INotificationGetListRequest = {
      action: "get-list",
    };
    this.sendWebSocketMessage(request);
  }

  public requestNotificationDetails(notificationId: string): void {
    const request: INotificationGetDetailsRequest = {
      action: "get-details",
      notificationId: notificationId,
    };
    this.sendWebSocketMessage(request);
  }

  public sendWebSocketMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message);
      console.log("Sending WebSocket message:", messageStr);
      this.websocket.send(messageStr);
    } else {
      console.warn("WebSocket is not connected, queuing message:", message);
      this.messageQueue.push(message);
    }
  }

  private handleNotificationListResponse(
    response: INotificationListResponse
  ): void {
    this.notifications = response.notifications || [];
    this.updateNotificationCount();
    this.renderNotifications();
  }

  private handleNotificationDetailsResponse(
    response: INotificationDetailsResponse
  ): void {
    // پیدا کردن و به‌روزرسانی نوتیفیکیشن در لیست
    const index = this.notifications.findIndex(
      (n) => n.id === response.notification.id
    );

    if (index !== -1) {
      this.notifications[index] = response.notification;
      this.renderNotifications();
    }

    // نمایش جزئیات (می‌تونی یک modal یا panel بسازی)
    this.showNotificationDetails(response.notification);
  }

  private showNotificationDetails(notification: INotificationItem): void {
    // نمایش جزئیات در modal
    if (this.modal) {
      this.modal.displayNotification(notification);
    }
  }

  private handleNotificationPush(response: INotificationPushResponse): void {
    console.log("New notification pushed from server:", response.notification);

    // چک کنیم که این نوتیفیکیشن از قبل وجود نداره
    const existingIndex = this.notifications.findIndex(
      (n) => n.id === response.notification.id
    );

    if (existingIndex === -1) {
      // اضافه کردن نوتیفیکیشن جدید به ابتدای لیست
      this.notifications.unshift(response.notification);
    } else {
      // به‌روزرسانی نوتیفیکیشن موجود
      this.notifications[existingIndex] = response.notification;
    }

    // به‌روزرسانی UI
    this.updateNotificationCount();
    this.renderNotifications();

    // نمایش اعلان بصری یا صوتی (اختیاری)
    this.showNewNotificationAlert();
  }

  private showNewNotificationAlert(): void {
    // می‌تونی اینجا یک اعلان بصری، صدا، یا animation اضافه کنی
    // مثلاً یک pulse animation روی badge
    const alarmElement = this.container.querySelector(
      "[data-bc-notification-alarm]"
    );

    if (alarmElement) {
      alarmElement.classList.add("pulse");
      setTimeout(() => {
        alarmElement.classList.remove("pulse");
      }, 1000);
    }
  }

  private handleNotificationSeenUpdate(
    response: INotificationSeenResponse
  ): void {
    console.log(
      "Notification seen update received:",
      response.notificationId,
      response.seenAt
    );

    // پیدا کردن نوتیفیکیشن مربوطه در لیست
    const index = this.notifications.findIndex(
      (n) => n.id === response.notificationId
    );

    if (index !== -1) {
      // به‌روزرسانی وضعیت seen
      this.notifications[index].seenAt = response.seenAt;
      this.notifications[index].seen = response.seenAt; // برای سازگاری با فیلدهای قدیمی

      // به‌روزرسانی UI
      this.updateNotificationCount();
      this.renderNotifications();

      console.log(
        `Notification ${response.notificationId} marked as seen at ${response.seenAt}`
      );
    } else {
      console.warn(
        `Notification ${response.notificationId} not found in local list`
      );
    }
  }

  private updateNotificationCount(): void {
    const unseenCount = this.notifications.filter(
      (n) => !n.seen && !n.seenAt
    ).length;
    const alarmElement = this.container.querySelector(
      "[data-bc-notification-alarm]"
    );

    if (alarmElement) {
      alarmElement.textContent = unseenCount.toString();

      if (unseenCount > 0) {
        alarmElement.setAttribute("style", "display: flex;");
      } else {
        alarmElement.setAttribute("style", "display: none;");
      }
    }

    this.container.setAttribute("data-count", unseenCount.toString());

    // به‌روزرسانی شمارنده‌های تب‌ها
    this.updateTabCounts();
  }

  private updateTabCounts(): void {
    // تب همه
    const allCount = this.notifications.filter(
      (n) => !n.seen && !n.seenAt
    ).length;
    this.updateTabCount("all", allCount);

    // تب‌ها بر اساس نوع
    const types = [
      NotificationType.ERROR,
      NotificationType.WARNING,
      NotificationType.NOTICE,
      NotificationType.OTHER,
    ];

    types.forEach((type) => {
      const count = this.notifications.filter(
        (n) => n.type === type && !n.seen && !n.seenAt
      ).length;
      this.updateTabCount(type.toString(), count);
    });
  }

  private updateTabCount(tabId: string, count: number): void {
    const button = this.tabButtons.get(tabId);
    if (!button) return;

    const badge = button.querySelector("[data-bc-tab-count]") as HTMLElement;
    if (!badge) return;

    if (count > 0) {
      badge.textContent = count.toString();
      badge.style.display = "inline-flex";
    } else {
      badge.style.display = "none";
    }
  }

  private renderNotifications(): void {
    const listContainer = this.container.querySelector(
      "[data-bc-notification-list]"
    );
    if (!listContainer) return;

    // دریافت نوتیفیکیشن‌های فیلتر شده
    const filteredNotifications = this.getFilteredNotifications();

    // پاک کردن لیست فعلی
    listContainer.innerHTML = "";

    if (filteredNotifications.length === 0) {
      // نمایش پیام خالی بودن
      const emptyMessage = document.createElement("div");
      emptyMessage.setAttribute("data-bc-notification-empty", "");
      emptyMessage.textContent = "در انتظار نوتیفیکیشن جدید";
      listContainer.appendChild(emptyMessage);
      return;
    }

    // نمایش نوتیفیکیشن‌ها
    filteredNotifications.forEach((notification) => {
      const notificationElement = this.createNotificationElement(notification);
      listContainer.appendChild(notificationElement);
    });
  }

  private getFilteredNotifications(): INotificationItem[] {
    if (this.currentTab === "all") {
      return this.notifications;
    }

    return this.notifications.filter((n) => n.type === this.currentTab);
  }

  private createNotificationElement(
    notification: INotificationItem
  ): HTMLElement {
    const element = document.createElement("div");
    element.setAttribute("data-bc-notification-item", "");
    element.setAttribute("data-notification-id", notification.id);
    element.setAttribute(
      "data-notification-type",
      notification.type.toString()
    );

    // تشخیص دیده شده یا نشده
    const isSeen = notification.seen || notification.seenAt;
    if (!isSeen) {
      element.setAttribute("data-unseen", "true");
    }

    // ساخت wrapper برای محتوا
    const contentWrapper = document.createElement("div");
    contentWrapper.style.cssText =
      "display: flex; flex-direction: column; gap: 8px;";

    // Header: عنوان
    const title = document.createElement("div");
    title.setAttribute("data-bc-notification-title", "");
    title.textContent = notification.title;
    contentWrapper.appendChild(title);

    // Footer: badge نوع و زمان
    const footer = document.createElement("div");
    footer.style.cssText =
      "display: flex; align-items: center; justify-content: space-between; gap: 8px;";

    // Badge نوع
    const typeLabel = this.getTypeLabel(notification.type);
    const typeBadge = document.createElement("span");
    typeBadge.setAttribute("data-bc-notification-type-badge", "");
    typeBadge.textContent = typeLabel;
    footer.appendChild(typeBadge);

    // نمایش زمان (اگر موجود باشد)
    if (notification.createdAt || notification.requestAt) {
      const timeElement = document.createElement("span");
      timeElement.style.cssText = "font-size: 11px; color: #9ca3af;";
      const timeStr = this.formatTime(
        notification.createdAt || notification.requestAt
      );
      timeElement.textContent = timeStr;
      footer.appendChild(timeElement);
    }

    contentWrapper.appendChild(footer);
    element.appendChild(contentWrapper);

    // افزودن رویداد کلیک
    element.addEventListener("click", () => {
      // باز کردن modal و درخواست جزئیات
      if (this.modal) {
        this.modal.open(notification.id);
      }
    });

    return element;
  }

  private convertUtcToLocal(utcDateString: string): Date {
    // تبدیل UTC به تاریخ محلی
    // اگر تاریخ بدون timezone suffix باشد (مثل "2025-12-25T12:43:03.589000")
    // باید Z اضافه کنیم تا به عنوان UTC تفسیر شود
    let dateStr = utcDateString.trim();

    // چک می‌کنیم که آیا timezone info داره یا نه
    const hasTimezone =
      dateStr.endsWith("Z") ||
      dateStr.includes("+") ||
      dateStr.includes("-", 10); // offset منفی مثل -05:00

    // اگر timezone نداره، Z اضافه می‌کنیم
    if (!hasTimezone) {
      dateStr = dateStr + "Z";
    }

    const date = new Date(dateStr);
    return date;
  }

  private formatTime(dateString: string | null | undefined): string {
    if (!dateString) return "";

    try {
      // تبدیل UTC به Local
      const date = this.convertUtcToLocal(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "الان";
      if (diffMins < 60) return `${diffMins} دقیقه پیش`;
      if (diffHours < 24) return `${diffHours} ساعت پیش`;
      if (diffDays < 7) return `${diffDays} روز پیش`;

      // برای تاریخ‌های قدیمی‌تر
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  }

  private getTypeLabel(type: NotificationType): string {
    switch (type) {
      case NotificationType.ERROR:
        return "خطا";
      case NotificationType.WARNING:
        return "هشدار";
      case NotificationType.NOTICE:
        return "اطلاعیه";
      case NotificationType.OTHER:
        return "سایر";
      default:
        return "";
    }
  }

  public getNotifications(): INotificationItem[] {
    return this.notifications;
  }

  public getNotificationsByType(type: number): INotificationItem[] {
    return this.notifications.filter((n) => n.type === type);
  }

  public runAsync(source?: ISource): boolean {
    // این متد دیگر برای WebSocket استفاده نمی‌شه
    // همه چیز از طریق event handler های WebSocket مدیریت میشه
    return true;
  }

  public dispose(): void {
    // بستن اتصال WebSocket
    this.isManualClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // پاکسازی modal
    if (this.modal) {
      this.modal.dispose();
      this.modal = null;
    }

    console.log("NotificationComponent disposed");
  }
}
