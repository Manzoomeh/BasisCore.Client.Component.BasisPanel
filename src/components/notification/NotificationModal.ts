import { INotificationItem, NotificationType } from "./INotificationItem";

export class NotificationModal {
  private modalElement: HTMLElement | null = null;
  private isOpen: boolean = false;
  private onRequestDetails: ((notificationId: string) => void) | null = null;
  private currentNotification: INotificationItem | null = null;
  private activeTab: "details" | "schema" = "details";

  constructor(
    private container: HTMLElement,
    requestDetailsCallback: (notificationId: string) => void
  ) {
    this.onRequestDetails = requestDetailsCallback;
    this.createModal();
  }

  private createModal(): void {
    // ایجاد overlay و modal
    const modal = document.createElement("div");
    modal.setAttribute("data-bc-notification-modal", "");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;

    // محتوای modal
    const modalContent = document.createElement("div");
    modalContent.setAttribute("data-bc-notification-modal-content", "");
    modalContent.style.cssText = `
      background: white;
      border-radius: 8px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    // Header
    const header = document.createElement("div");
    header.setAttribute("data-bc-notification-modal-header", "");
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;

    const headerTitle = document.createElement("h3");
    headerTitle.setAttribute("data-bc-notification-modal-title", "");
    headerTitle.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    `;
    headerTitle.textContent = "جزئیات نوتیفیکیشن";

    const closeButton = document.createElement("button");
    closeButton.setAttribute("data-bc-notification-modal-close", "");
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    `;
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => this.close());

    closeButton.addEventListener("mouseenter", () => {
      closeButton.style.background = "#f3f4f6";
    });
    closeButton.addEventListener("mouseleave", () => {
      closeButton.style.background = "none";
    });

    header.appendChild(headerTitle);
    header.appendChild(closeButton);

    // Tabs
    const tabsContainer = document.createElement("div");
    tabsContainer.setAttribute("data-bc-notification-modal-tabs", "");
    tabsContainer.style.cssText = `
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    `;

    const tab1 = document.createElement("button");
    tab1.setAttribute("data-bc-notification-tab", "details");
    tab1.textContent = "جزئیات";
    tab1.style.cssText = `
      flex: 1;
      padding: 12px 20px;
      background: white;
      border: none;
      border-bottom: 2px solid #3b82f6;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #3b82f6;
      transition: all 0.2s;
    `;

    const tab2 = document.createElement("button");
    tab2.setAttribute("data-bc-notification-tab", "schema");
    tab2.textContent = "اسکیما";
    tab2.style.cssText = `
      flex: 1;
      padding: 12px 20px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
    `;

    tab1.addEventListener("click", () => this.switchTab("details"));
    tab2.addEventListener("click", () => this.switchTab("schema"));

    tabsContainer.appendChild(tab1);
    tabsContainer.appendChild(tab2);

    // Body
    const body = document.createElement("div");
    body.setAttribute("data-bc-notification-modal-body", "");
    body.style.cssText = `
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    `;

    // Loading indicator
    const loading = document.createElement("div");
    loading.setAttribute("data-bc-notification-modal-loading", "");
    loading.style.cssText = `
      display: none;
      text-align: center;
      padding: 40px;
      color: #6b7280;
    `;
    loading.textContent = "در حال بارگذاری...";

    // Content container
    const content = document.createElement("div");
    content.setAttribute("data-bc-notification-modal-body-content", "");

    // Schema content container (hidden by default)
    const schemaContent = document.createElement("div");
    schemaContent.setAttribute("data-bc-notification-modal-schema-content", "");
    schemaContent.style.cssText = `
      display: none;
    `;
    schemaContent.innerHTML = `


<div data-msg-content>
  <Basis core="api" url="https://basispanel.ai/proxy/A8EFE128-E1E6-4BA7-A8B9-ABD306574725/userslog/view/694c1e91af76ac135614c107" method="get" run="atclient">
  </Basis>
  <button data-btn-edit>Edit</button>
  <Basis core="schema" datamembername="answer.data" run="atclient" schemaUrl="https://basispanel.ai/schema" displayMode="edit" button="[data-btn-edit]" resultSourceId="demo.data">
  </Basis>
  <button data-btn-edit>Edit</button>
  <basis core="callback" run="atclient" triggers="demo.data"></basis>
</div>
<script>
  (() => {
    const content = document.querySelector('[data-msg-content]');
    if (content)
      alert('Notification Schema Data:', content.innerHTML);
  })();
</script>

    `;

    body.appendChild(loading);
    body.appendChild(content);
    body.appendChild(schemaContent);

    // Footer (optional)
    const footer = document.createElement("div");
    footer.setAttribute("data-bc-notification-modal-footer", "");
    footer.style.cssText = `
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `;

    const closeFooterButton = document.createElement("button");
    closeFooterButton.textContent = "بستن";
    closeFooterButton.style.cssText = `
      padding: 8px 16px;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;
    closeFooterButton.addEventListener("click", () => this.close());
    closeFooterButton.addEventListener("mouseenter", () => {
      closeFooterButton.style.background = "#e5e7eb";
    });
    closeFooterButton.addEventListener("mouseleave", () => {
      closeFooterButton.style.background = "#f3f4f6";
    });

    footer.appendChild(closeFooterButton);

    // ترکیب المان‌ها
    modalContent.appendChild(header);
    modalContent.appendChild(tabsContainer);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);

    // اضافه کردن به DOM
    document.body.appendChild(modal);
    this.modalElement = modal;

    // بستن با کلیک روی overlay
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    // بستن با کلید Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  public open(notificationId: string): void {
    if (!this.modalElement) return;

    this.isOpen = true;
    this.modalElement.style.display = "flex";
    document.body.style.overflow = "hidden"; // جلوگیری از scroll صفحه

    // نمایش loading
    this.showLoading();

    // درخواست جزئیات
    if (this.onRequestDetails) {
      this.onRequestDetails(notificationId);
    }
  }

  public close(): void {
    if (!this.modalElement) return;

    this.isOpen = false;
    this.modalElement.style.display = "none";
    document.body.style.overflow = ""; // بازگشت scroll صفحه
    this.currentNotification = null;
  }

  private switchTab(tabName: "details" | "schema"): void {
    if (!this.modalElement) return;

    this.activeTab = tabName;

    // Update tab buttons
    const tabs = this.modalElement.querySelectorAll(
      "[data-bc-notification-tab]"
    );
    tabs.forEach((tab) => {
      const tabElement = tab as HTMLElement;
      const tabType = tabElement.getAttribute("data-bc-notification-tab");

      if (tabType === tabName) {
        tabElement.style.background = "white";
        tabElement.style.color = "#3b82f6";
        tabElement.style.borderBottom = "2px solid #3b82f6";
      } else {
        tabElement.style.background = "transparent";
        tabElement.style.color = "#6b7280";
        tabElement.style.borderBottom = "2px solid transparent";
      }
    });

    // Update content visibility
    const detailsContent = this.modalElement.querySelector(
      "[data-bc-notification-modal-body-content]"
    ) as HTMLElement;
    const schemaContent = this.modalElement.querySelector(
      "[data-bc-notification-modal-schema-content]"
    ) as HTMLElement;

    if (detailsContent && schemaContent) {
      if (tabName === "details") {
        detailsContent.style.display = "block";
        schemaContent.style.display = "none";
      } else {
        detailsContent.style.display = "none";
        schemaContent.style.display = "block";
      }
    }
  }

  private showLoading(): void {
    if (!this.modalElement) return;

    const loading = this.modalElement.querySelector(
      "[data-bc-notification-modal-loading]"
    ) as HTMLElement;
    const content = this.modalElement.querySelector(
      "[data-bc-notification-modal-body-content]"
    ) as HTMLElement;

    if (loading) loading.style.display = "block";
    if (content) content.innerHTML = "";
  }

  private hideLoading(): void {
    if (!this.modalElement) return;

    const loading = this.modalElement.querySelector(
      "[data-bc-notification-modal-loading]"
    ) as HTMLElement;

    if (loading) loading.style.display = "none";
  }

  public displayNotification(notification: INotificationItem): void {
    this.currentNotification = notification;
    this.hideLoading();

    if (!this.modalElement) return;

    const content = this.modalElement.querySelector(
      "[data-bc-notification-modal-body-content]"
    ) as HTMLElement;

    if (!content) return;

    // پاک کردن محتوای قبلی
    content.innerHTML = "";

    // ساخت محتوای جزئیات
    const detailsContainer = document.createElement("div");
    detailsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    // عنوان
    const titleSection = this.createDetailSection("عنوان", notification.title);
    detailsContainer.appendChild(titleSection);

    // نوع
    const typeLabel = this.getTypeLabel(notification.type);
    const typeSection = this.createDetailSection("نوع", typeLabel);
    detailsContainer.appendChild(typeSection);

    // زمان ایجاد
    if (notification.createdAt || notification.requestAt) {
      const dateStr = this.formatDate(
        notification.createdAt || notification.requestAt
      );
      const timeSection = this.createDetailSection("زمان", dateStr);
      detailsContainer.appendChild(timeSection);
    }

    // وضعیت دیده شده
    const seenStatus =
      notification.seen || notification.seenAt ? "دیده شده" : "جدید";
    const seenSection = this.createDetailSection("وضعیت", seenStatus);
    detailsContainer.appendChild(seenSection);

    // محتوای اضافی (data)
    if (notification.data) {
      const dataSection = this.createDetailSection(
        "اطلاعات اضافی",
        this.formatData(notification.data)
      );
      detailsContainer.appendChild(dataSection);
    }

    content.appendChild(detailsContainer);
  }

  private createDetailSection(label: string, value: string): HTMLElement {
    const section = document.createElement("div");
    section.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;

    const labelElement = document.createElement("div");
    labelElement.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
    `;
    labelElement.textContent = label;

    const valueElement = document.createElement("div");
    valueElement.style.cssText = `
      font-size: 14px;
      color: #111827;
      line-height: 1.5;
    `;
    valueElement.textContent = value;

    section.appendChild(labelElement);
    section.appendChild(valueElement);

    return section;
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
        return "نامشخص";
    }
  }

  private formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "نامشخص";

    try {
      // تبدیل به UTC اگر لازم باشد
      let dateStr = dateString.trim();
      const hasTimezone =
        dateStr.endsWith("Z") ||
        dateStr.includes("+") ||
        dateStr.includes("-", 10);

      if (!hasTimezone) {
        dateStr = dateStr + "Z";
      }

      const date = new Date(dateStr);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  }

  private formatData(data: any): string {
    if (typeof data === "string") {
      return data;
    }

    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  }

  public dispose(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
    this.isOpen = false;
    document.body.style.overflow = "";
  }
}
