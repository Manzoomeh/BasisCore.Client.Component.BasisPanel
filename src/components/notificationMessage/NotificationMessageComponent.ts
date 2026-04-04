import { IDependencyContainer, ISource, IUserDefineComponent } from "basiscore";
import HttpUtil from "../../HttpUtil";
import LocalStorageUtil from "../../LocalStorageUtil";
import { IModuleInfo } from "../../type-alias";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import IPageLoader from "../menu/IPageLoader";
import desktopLayout from "./assets/desktop-layout.html";
import mobileLayout from "./assets/mobile-layout.html";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import type { IMessageInfo, IMessageTemplateValue } from "./INotificationMessage";
import INotificationMessage from "./INotificationMessage";

type MessageType = number;
type PanelLevel = 0 | 1 | 2 | 3;

type ErrorMessageItem = {
  messageType: MessageType;
  messages: Record<string, string>;
};

type ErrorCacheEntry = {
  date: number;
  v: string;
  values: Record<string, ErrorMessageItem>;
};

type ErrorCacheMap = Record<string, ErrorCacheEntry>;

type RawCultureItem = {
  lid: number;
  message: string;
};

type RawMessageItem = {
  id: number;
  messageType: MessageType;
  culture: RawCultureItem[];
};

type RawMessageResponse = {
  v: string;
  messages: RawMessageItem[];
};

type NotificationQueueItem = {
  Errorid: string | number;
  Lid?: number;
  Type?: number;
  Message?: string;
  templateValue?: IMessageTemplateValue;
  time?: number;
};

type ModuleContext = {
  cacheKey: string;
  moduleUrl: string;
  isInternal: boolean;
  moduleId: number;
  levelId: PanelLevel;
};

type DefaultMessageItem = {
  id: number;
  messageType: MessageType;
  culture: RawCultureItem[];
};

const CACHE_STORAGE_KEY = "errorKeys";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const LEVEL_PADDING = 4;
const GENERAL_INTERNAL_MODULE_ID = 1;

export default class NotificationMessageComponent
  extends BasisPanelChildComponent
  implements INotificationMessage
{
  public messageQueue: NotificationQueueItem[] = [];
  public defaultMessages: DefaultMessageItem[];

  private messageActionCases = {
    1: (message: string, time?: number) =>
      this.showSuccessMessage(message, time),
    2: (message: string, time?: number) => this.showErrorMessage(message, time),
    3: (message: string, time?: number) => this.showInfoMessage(message, time),
    4: (message: string, time?: number) =>
      this.showDefaultMessage(message, time),
    get: function (key: number) {
      return this.hasOwnProperty(key) ? this[key] : this[4];
    },
  };

  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-message-container");

    this.defaultMessages = [
      {
        id: 1,
        messageType: 1,
        culture: [
          {
            lid: 1,
            message: "با موفقیت انجام شد",
          },
          {
            lid: 2,
            message: "successful",
          },
        ],
      },
    ];

    const cached = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!cached) {
      this.getGeneralErrors();
    }

    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("message", this);
  }

  public initializeAsync(): Promise<void> {
    return Promise.resolve();
  }

  private buildErrorCacheKey(moduleId: number, levelId: number): string {
    return `${moduleId}${levelId.toString().padStart(LEVEL_PADDING, "0")}`;
  }

  private mapLevelToNumber(level?: string): PanelLevel {
    switch ((level || "").toLowerCase()) {
      case "profile":
        return 1;
      case "corporate":
        return 2;
      case "business":
        return 3;
      default:
        return 0;
    }
  }

  private getCacheObject(): ErrorCacheMap {
    try {
      return JSON.parse(localStorage.getItem(CACHE_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  private setCacheObject(cacheObject: ErrorCacheMap): void {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheObject));
  }

  private isCacheFresh(cacheEntry?: ErrorCacheEntry | null): boolean {
    if (!cacheEntry || !cacheEntry.values) {
      return false;
    }

    if (!cacheEntry.date) {
      return false;
    }

    return new Date().getTime() - cacheEntry.date < CACHE_TTL;
  }

  private mapMessagesToCacheValues(
    messages: RawMessageItem[],
  ): Record<string, ErrorMessageItem> {
    const values: Record<string, ErrorMessageItem> = {};

    (messages || []).forEach((item) => {
      try {
        if (!item || item.id == null) {
          return;
        }

        values[String(item.id)] = {
          messageType: item.messageType,
          messages: {},
        };

        (item.culture || []).forEach((cultureItem) => {
          values[String(item.id)].messages[String(cultureItem.lid)] =
            cultureItem.message;
        });
      } catch {
        // ignore malformed item and keep processing the rest
      }
    });

    return values;
  }

  private getGeneralErrorUrl(): string {
    return HttpUtil.formatString(this.options.culture.generalErrorMessages, {
      rKey: this.options.rKey,
    });
  }

  private getModuleErrorUrl(moduleContext: ModuleContext): string {
    if (moduleContext.isInternal) {
      return this.getGeneralErrorUrl();
    }

    return HttpUtil.formatString(
      moduleContext.moduleUrl + this.options.method.errorMessages,
      {
        rKey: this.options.rKey,
      },
    );
  }

  private isInternalModuleByUrl(moduleUrl: string): boolean {
    return (
      this.options.baseUrl.business == moduleUrl ||
      this.options.baseUrl.corporate == moduleUrl ||
      this.options.baseUrl.profile == moduleUrl
    );
  }

  private getModuleInfo(): IModuleInfo | null {
    try {
      return this.owner.dc.resolve<IPageLoader>("page_loader").getModuleInfo(
        LocalStorageUtil.level,
        LocalStorageUtil.getLevelValue(LocalStorageUtil.level),
        LocalStorageUtil.moduleId,
      );
    } catch (ex) {
      console.error(ex);
      return null;
    }
  }

  private getModuleContext(): ModuleContext {
    const moduleInfo = this.getModuleInfo();
    const moduleUrl = moduleInfo?.url || "/";
    const moduleId = Number(moduleInfo?.id ?? LocalStorageUtil.moduleId ?? 0);

    const isInternal =
    moduleId === GENERAL_INTERNAL_MODULE_ID ||
    this.isInternalModuleByUrl(moduleUrl);
    

    const levelId: PanelLevel = isInternal
      ? 0
      : this.mapLevelToNumber(LocalStorageUtil.level);

    return {
      cacheKey: this.buildErrorCacheKey(moduleId, levelId),
      moduleUrl,
      isInternal,
      moduleId,
      levelId,
    };
  }

  private getAlternativeCacheKeys(moduleContext: ModuleContext): string[] {
    const keys: string[] = [];

    if (moduleContext.isInternal) {
      keys.push(this.buildErrorCacheKey(moduleContext.moduleId, 0));
      return keys;
    }

    keys.push(this.buildErrorCacheKey(moduleContext.moduleId, 1));
    keys.push(this.buildErrorCacheKey(moduleContext.moduleId, 2));
    keys.push(this.buildErrorCacheKey(moduleContext.moduleId, 3));

    return Array.from(new Set(keys));
  }

  private findErrorItemAcrossCache(
    errorId: string | number,
    moduleContext: ModuleContext,
  ): ErrorMessageItem | null {
    const cacheObject = this.getCacheObject();
    const normalizedErrorId = String(errorId);

    const directItem =
      cacheObject[moduleContext.cacheKey]?.values?.[normalizedErrorId];
    if (directItem) {
      return directItem;
    }

    const legacyKey = moduleContext.isInternal ? "/" : moduleContext.moduleUrl;
    const legacyItem = cacheObject[legacyKey]?.values?.[normalizedErrorId];
    if (legacyItem) {
      return legacyItem;
    }

    const alternativeKeys = this.getAlternativeCacheKeys(moduleContext);
    for (const key of alternativeKeys) {
      const item = cacheObject[key]?.values?.[normalizedErrorId];
      if (item) {
        return item;
      }
    }

    for (const key of Object.keys(cacheObject)) {
      const item = cacheObject[key]?.values?.[normalizedErrorId];
      if (item) {
        return item;
      }
    }

    return null;
  }

  private migrateLegacyCache(
    cacheObject: ErrorCacheMap,
    moduleContext: ModuleContext,
  ): ErrorCacheMap {
    const currentEntry = cacheObject[moduleContext.cacheKey];
    if (currentEntry?.values) {
      return cacheObject;
    }

    const legacyKey = moduleContext.isInternal ? "/" : moduleContext.moduleUrl;
    const legacyEntry = cacheObject[legacyKey];

    if (legacyEntry?.values) {
      cacheObject[moduleContext.cacheKey] = legacyEntry;
      this.setCacheObject(cacheObject);
    }

    return cacheObject;
  }

  private getDefaultMessageInfo(
    messageId: number,
    lid: number,
  ): IMessageInfo | null {
    const defaultMessage = this.defaultMessages.find(
      (item) => item.id == messageId,
    );
    if (!defaultMessage) {
      return null;
    }

    const cultureItem =
      defaultMessage.culture.find((item) => item.lid == lid) ||
      defaultMessage.culture[0];

    if (!cultureItem) {
      return null;
    }

    return {
      message: cultureItem.message,
      type: defaultMessage.messageType,
    };
  }

  private saveCacheEntry(
    cacheKey: string,
    version: string,
    messages: RawMessageItem[],
  ): ErrorCacheEntry {
    const cacheObject = this.getCacheObject();
    const entry: ErrorCacheEntry = {
      date: new Date().getTime(),
      v: version,
      values: this.mapMessagesToCacheValues(messages),
    };

    cacheObject[cacheKey] = entry;
    this.setCacheObject(cacheObject);

    return entry;
  }

  private async fetchAndCacheMessages(
    moduleContext: ModuleContext,
  ): Promise<ErrorCacheEntry | null> {
    const url = this.getModuleErrorUrl(moduleContext);
    const response: RawMessageResponse = await HttpUtil.checkRkeyFetchDataAsync(
      url,
      "GET",
      this.options.checkRkey,
    );

    if (!response) {
      return null;
    }

    return this.saveCacheEntry(
      moduleContext.cacheKey,
      response.v,
      response.messages || [],
    );
  }

  private async ensureCache(
    moduleContext: ModuleContext,
    forceRefresh: boolean = false,
  ): Promise<ErrorCacheEntry | null> {
    let cacheObject = this.getCacheObject();
    cacheObject = this.migrateLegacyCache(cacheObject, moduleContext);

    const currentEntry = cacheObject[moduleContext.cacheKey];
    if (!forceRefresh && this.isCacheFresh(currentEntry)) {
      return currentEntry;
    }

    const refreshed = await this.fetchAndCacheMessages(moduleContext);
    return refreshed || currentEntry || null;
  }

  private normalizeLid(lid?: number): number {
    return Number(lid ?? parseInt(this.options.lid ?? "1", 10) ?? 1);
  }

  private getCachedErrorItem(
    cacheEntry: ErrorCacheEntry | null,
    errorId: string | number,
  ): ErrorMessageItem | null {
    if (!cacheEntry?.values) {
      return null;
    }

    return cacheEntry.values[String(errorId)] || null;
  }

  private async resolveMessageInfo(
    messageId: number,
    lid?: number,
  ): Promise<IMessageInfo | null> {
    const normalizedLid = this.normalizeLid(lid);
    const moduleContext = this.getModuleContext();

    try {
      let cacheEntry = await this.ensureCache(moduleContext);
      let cachedItem = this.getCachedErrorItem(cacheEntry, messageId);

      if (!cachedItem) {
        cachedItem = this.findErrorItemAcrossCache(messageId, moduleContext);
      }

      if (!cachedItem || !cachedItem.messages[String(normalizedLid)]) {
        cacheEntry = await this.ensureCache(moduleContext, true);
        cachedItem = this.getCachedErrorItem(cacheEntry, messageId);

        if (!cachedItem) {
          cachedItem = this.findErrorItemAcrossCache(messageId, moduleContext);
        }
      }

      if (cachedItem) {
        const message =
          cachedItem.messages[String(normalizedLid)] ||
          cachedItem.messages[String(this.normalizeLid())] ||
          cachedItem.messages[Object.keys(cachedItem.messages)[0]];

        if (message) {
          return {
            message,
            type: cachedItem.messageType,
          };
        }
      }
    } catch {
      // fallback to default messages below
    }

    return this.getDefaultMessageInfo(messageId, normalizedLid);
  }

  private formatTemplateMessage(
    message: string,
    templateValue?: IMessageTemplateValue,
  ): string {
    if (!message) {
      return message;
    }

    return message.replace(/\$\{(.*?)\}/g, (_match, value) => {
      const key = String(value).trim();
      if (
        templateValue &&
        Object.prototype.hasOwnProperty.call(templateValue, key)
      ) {
        const content = templateValue[key];
        return `<strong>${content == null ? "" : content}</strong>`;
      }

      return "";
    });
  }

  private async getGeneralErrors() {
    const generalContext: ModuleContext = {
      cacheKey: this.buildErrorCacheKey(GENERAL_INTERNAL_MODULE_ID, 0),
      moduleUrl: "/",
      isInternal: true,
      moduleId: GENERAL_INTERNAL_MODULE_ID,
      levelId: 0,
    };

    try {
      await this.ensureCache(generalContext, true);
    } catch {
      // do not break component initialization because of cache warmup failure
    }
  }

  public async checkErrorCode(errorid: string, cacheKey: string) {
    const cacheObject = this.getCacheObject();
    const cachedItem = cacheObject[cacheKey]?.values?.[String(errorid)];

    if (!cachedItem) {
      return null;
    }

    if (this.isCacheFresh(cacheObject[cacheKey])) {
      return cachedItem;
    }

    return cachedItem;
  }

  public async getMessageAsync(
    messageId: number,
    params?: any,
    lid?: number,
  ): Promise<IMessageInfo | null> {
    try {
      const messageInfo = await this.resolveMessageInfo(messageId, lid);
      if (!messageInfo) {
        return null;
      }

      let message = messageInfo.message;
      if (params) {
        message = HttpUtil.formatString(message, params);
      }

      return {
        message,
        type: messageInfo.type,
      };
    } catch {
      return this.getDefaultMessageInfo(messageId, this.normalizeLid(lid));
    }
  }

  public async showByMessageIdAsync(
    messageId: number,
    params?: any,
    lid?: number,
    time?: number,
  ): Promise<void> {
    const messageInfo = await this.getMessageAsync(messageId, params, lid);
    if (messageInfo) {
      this.showByMessage(messageInfo.message, messageInfo.type, time);
    }
  }

  public showByMessage(message: string, type?: number, time?: number): void {
    this.messageActionCases.get(type)(message, time);
  }

  private async showMessage() {
    document.querySelector("[data-bc-notification-custom-css]")?.remove();

    const queueItem = this.messageQueue.shift();
    if (!queueItem) {
      return;
    }

    const { Message, Errorid, Lid, Type, templateValue, time } = queueItem;

    let message = Message || null;
    let type = Type ?? null;
    const lid = this.normalizeLid(Lid);

    if (!(message || type)) {
      const messageInfo = await this.getMessageAsync(Number(Errorid), null, lid);
      message = messageInfo?.message || null;
      type = messageInfo?.type ?? null;
    }

    if (message) {
      const newText = this.formatTemplateMessage(message, templateValue);
      this.messageActionCases.get(type)(newText, time);
    }
  }

  showInfoMessage(message: string, time?: number) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");
    container.innerHTML = `<div class="NotificationMessage-content" >
    <svg enable-background="new 0 0 48 48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" height="40px" width="40px"><circle cx="24" cy="24" fill="#005386" r="21"/><g fill="#fff"><path d="m22 22h4v11h-4z"/><circle cx="24" cy="16.5" r="2.5"/></g></svg>
    <div class="message">
        <span id="messageText" class="text text-2"> ${message} </span>
    </div>
</div><div class="progress info-progress"></div>`;
    const progress = document.querySelector(".progress");
    if (time) {
      const customcss = document.createElement("style");
      customcss.setAttribute("data-bc-notification-custom-css", "");
      const css = `[data-bc-bp-direction="rightToLeft"] .activeNotification:before {
        animation: progressLeft ${time}s linear forwards;
        }
        [data-bc-bp-direction="leftToRight"] .activeNotification:before {
          animation: progressRight ${time}s linear forwards;
          }`;
      customcss.innerHTML = css;
      document.head.appendChild(customcss);
    }
    progress.classList.add("activeNotification");

    container.setAttribute("data-bc-message-info", "");
    container.setAttribute("data-sys-message-fade-in", "");
    setTimeout(
      () => {
        container.removeAttribute("data-sys-message-fade-in");
        container.setAttribute("data-sys-message-fade-out", "");
        container.removeAttribute("data-bc-message-info");
        progress.classList.remove("activeNotification");

        setTimeout(() => {
          if (this.messageQueue.length != 0) {
            this.showMessage();
          }
        }, 500);
      },
      time ? time * 1000 : 3000,
    );
  }

  showSuccessMessage(message: string, time?: number) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");

    container.innerHTML = `<div class="NotificationMessage-content" >
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 36.8332C9.85754 36.8332 5.53633 36.8332 2.85148 34.1483C0.166626 31.4635 0.166626 27.1423 0.166626 18.4998C0.166626 9.85742 0.166626 5.53621 2.85148 2.85136C5.53633 0.166504 9.85754 0.166504 18.5 0.166504C27.1424 0.166504 31.4636 0.166504 34.1484 2.85136C36.8333 5.53621 36.8333 9.85742 36.8333 18.4998C36.8333 27.1423 36.8333 31.4635 34.1484 34.1483C31.4636 36.8332 27.1424 36.8332 18.5 36.8332ZM25.8889 12.9442C26.4259 13.4812 26.4259 14.3518 25.8889 14.8888L16.7222 24.0554C16.1853 24.5924 15.3147 24.5924 14.7777 24.0554L11.111 20.3888C10.574 19.8518 10.574 18.9812 11.111 18.4442C11.648 17.9073 12.5186 17.9073 13.0556 18.4442L15.75 21.1386L23.9444 12.9442C24.4813 12.4073 25.3519 12.4073 25.8889 12.9442Z" fill="#006A5E"/>
    </svg>
    <div class="message">
        <span id="messageText" class="text text-2"> ${message} </span>
    </div>
</div><div class="progress success-progress"></div>`;
    const progress = document.querySelector(".progress");
    if (time) {
      const customcss = document.createElement("style");
      customcss.setAttribute("data-bc-notification-custom-css", "");
      const css = `[data-bc-bp-direction="rightToLeft"] .activeNotification:before {
        animation: progressLeft ${time}s linear forwards;
        }
        [data-bc-bp-direction="leftToRight"] .activeNotification:before {
          animation: progressRight ${time}s linear forwards;
          }`;
      customcss.innerHTML = css;
      document.head.appendChild(customcss);
    }
    progress.classList.add("activeNotification");
    if (time) {
      const customcss = document.createElement("style");
      customcss.setAttribute("data-bc-notification-custom-css", "");
      const css = `[data-bc-bp-direction="rightToLeft"] .activeNotification:before {
        animation: progressLeft ${time}s linear forwards;
        }
        [data-bc-bp-direction="leftToRight"] .activeNotification:before {
          animation: progressRight ${time}s linear forwards;
          }`;
      customcss.innerHTML = css;
      document.head.appendChild(customcss);
    }
    container.setAttribute("data-bc-message-success", "");
    container.setAttribute("data-sys-message-fade-in", "");
    setTimeout(
      () => {
        container.removeAttribute("data-sys-message-fade-in");
        container.setAttribute("data-sys-message-fade-out", "");
        container.removeAttribute("data-bc-message-success");
        progress.classList.remove("activeNotification");

        setTimeout(() => {
          if (this.messageQueue.length != 0) {
            this.showMessage();
          }
        }, 500);
      },
      time ? time * 1000 : 3000,
    );
  }

  showErrorMessage(message: string, time?: number) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");
    container.setAttribute("data-sys-message-fade-in", "");

    container.innerHTML = `<div class="NotificationMessage-content" >
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 36.8332C9.85754 36.8332 5.53634 36.8332 2.85148 34.1483C0.166626 31.4635 0.166626 27.1423 0.166626 18.4998C0.166626 9.85742 0.166626 5.53621 2.85148 2.85136C5.53634 0.166504 9.85754 0.166504 18.5 0.166504C27.1424 0.166504 31.4636 0.166504 34.1484 2.85136C36.8333 5.53621 36.8333 9.85742 36.8333 18.4998C36.8333 27.1423 36.8333 31.4635 34.1484 34.1483C31.4636 36.8332 27.1424 36.8332 18.5 36.8332ZM12.9443 12.9442C13.4813 12.4073 14.3519 12.4073 14.8889 12.9442L18.4999 16.5553L22.111 12.9443C22.648 12.4073 23.5186 12.4073 24.0555 12.9443C24.5925 13.4812 24.5925 14.3518 24.0555 14.8888L20.4445 18.4999L24.0555 22.1109C24.5925 22.6478 24.5925 23.5184 24.0555 24.0554C23.5185 24.5924 22.6479 24.5924 22.1109 24.0554L18.4999 20.4444L14.8889 24.0554C14.3519 24.5924 13.4813 24.5924 12.9444 24.0554C12.4074 23.5185 12.4074 22.6479 12.9444 22.1109L16.5554 18.4999L12.9443 14.8888C12.4073 14.3518 12.4073 13.4812 12.9443 12.9442Z" fill="#B40020"/>
    </svg>
    <div class="message">
        <span id="messageText" class="text text-2"> ${message} </span>
    </div>
</div><div class="progress error-progress"></div>
    `;
    const progress = document.querySelector(".progress");
    progress.classList.add("activeNotification");
    container.setAttribute("data-bc-message-error", "");
    setTimeout(
      () => {
        container.removeAttribute("data-sys-message-fade-in");
        container.setAttribute("data-sys-message-fade-out", "");
        container.removeAttribute("data-bc-message-error");

        progress.classList.remove("activeNotification");
        setTimeout(() => {
          if (this.messageQueue.length != 0) {
            this.showMessage();
          }
        }, 500);
      },
      time ? time * 1000 : 3000,
    );
  }

  showDefaultMessage(message: string, time?: number) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");
    container.setAttribute("data-sys-message-fade-in", "");

    container.innerHTML = `<div class="NotificationMessage-content" >
    <svg width="37" height="33" viewBox="0 0 37 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.23749 14.2294C11.5878 4.74314 14.263 0 18.4993 0C22.7357 0 25.4109 4.74313 30.7612 14.2294L31.4279 15.4115C35.874 23.2945 38.0971 27.236 36.0879 30.118C34.0787 33 29.1078 33 19.1661 33H17.8326C7.89088 33 2.92 33 0.91082 30.118C-1.09836 27.236 1.12469 23.2945 5.57078 15.4115L6.23749 14.2294ZM18.4993 7.79167C19.2587 7.79167 19.8743 8.40728 19.8743 9.16667V18.3333C19.8743 19.0927 19.2587 19.7083 18.4993 19.7083C17.74 19.7083 17.1243 19.0927 17.1243 18.3333V9.16667C17.1243 8.40728 17.74 7.79167 18.4993 7.79167ZM18.4993 25.6667C19.5119 25.6667 20.3327 24.8459 20.3327 23.8333C20.3327 22.8208 19.5119 22 18.4993 22C17.4868 22 16.666 22.8208 16.666 23.8333C16.666 24.8459 17.4868 25.6667 18.4993 25.6667Z" fill="#E96228"/>
    </svg>
    
    <div class="message">
        <span id="messageText" class="text text-2"> ${message} </span>
    </div>
</div><div class="progress default-progress"></div>
    `;
    const progress = document.querySelector(".progress");
    if (time) {
      const customcss = document.createElement("style");
      customcss.setAttribute("data-bc-notification-custom-css", "");
      const css = `[data-bc-bp-direction="rightToLeft"] .activeNotification:before {
        animation: progressLeft ${time}s linear forwards;
        }
        [data-bc-bp-direction="leftToRight"] .activeNotification:before {
          animation: progressRight ${time}s linear forwards;
          }`;
      customcss.innerHTML = css;
      document.head.appendChild(customcss);
    }
    progress.classList.add("activeNotification");
    container.setAttribute("data-bc-message-default", "");
    setTimeout(
      () => {
        container.removeAttribute("data-sys-message-fade-in");
        container.setAttribute("data-sys-message-fade-out", "");
        container.removeAttribute("data-bc-message-default");

        progress.classList.remove("activeNotification");
        setTimeout(() => {
          if (this.messageQueue.length != 0) {
            this.showMessage();
          }
        }, 500);
      },
      time ? time * 1000 : 3000,
    );
  }

  public async getMessageTypeByErrorId(errorid: number) {
    try {
      const messageInfo = await this.resolveMessageInfo(
        errorid,
        this.normalizeLid(),
      );
      return messageInfo?.type ?? null;
    } catch {
      const fallback = this.getDefaultMessageInfo(
        errorid,
        this.normalizeLid(),
      );
      return fallback?.type ?? null;
    }
  }

  public async NotificationMessageMethod(
    Errorid: string | number,
    Lid?: number,
    Type?: number,
    Message?: string,
    templateValue?: IMessageTemplateValue,
    time?: number,
  ) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");
    this.messageQueue.push({
      Errorid,
      Lid,
      Type,
      Message,
      templateValue,
      time,
    });

    if (!container.hasAttribute("data-sys-message-fade-in")) {
      this.showMessage();
    }
  }

  public runAsync(source?: ISource) {
    return true;
  }
}