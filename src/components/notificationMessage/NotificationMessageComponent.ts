import { IDependencyContainer, ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/desktop-layout.html";
import mobileLayout from "./assets/mobile-layout.html";
import "./assets/style-desktop.css";
import "./assets/style-mobile.css";
import INotifiationMessage from "./INotificationMessage";
import HttpUtil from "../../HttpUtil";
import LocalStorageUtil from "../../LocalStorageUtil";

export default class NotificationMessageComponent
  extends BasisPanelChildComponent
  implements INotifiationMessage
{
  public messageQueue = [];
  public defaultMessages;
  private messageActionCases = {
    1: (message) => this.showSuccessMessage(message),
    2: (message) => this.showErrorMessage(message),
    3: (message) => this.showInfoMessage(message),
    4: (message) => this.showDefaultMessage(message),
    get: function (key) {
      return this.hasOwnProperty(key) ? this[key] : this[4];
    },
  };
  constructor(owner: IUserDefineComponent) {
    super(owner, desktopLayout, mobileLayout, "data-bc-bp-message-container");
    this.defaultMessages = [
      {
        id: 1.0,
        messageType: 1,
        culture: [
          {
            lid: 1.0,
            message: "با موفقیت انجام شد",
          },
          {
            lid: 2.0,
            message: "successful",
          },
        ],
      },
    ];
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("message", this);
  }

  public initializeAsync(): Promise<void> {
    return Promise.resolve();
  }
  public checkErrorCode(errorid: string, mid: string) {
    const cached = JSON.parse(localStorage.getItem("errorKeys"));
    let messageData;
    if (cached && cached["/"] && cached["/"]?.values[errorid]) {
      messageData = cached["/"].values[errorid];
      const currentDate = new Date().getTime();

      if (
        messageData.messages &&
        currentDate - cached["/"].date < 3600 * 1000 * 24
      ) {
        return messageData;
      }
    } else {
      if (cached && cached[mid] && cached[mid]?.values[errorid]) {
        messageData = cached[mid].values[errorid];
        if (messageData) {
          const currentDate = new Date().getTime();

          if (currentDate - cached[mid].date < 3600 * 1000 * 24) {
            return messageData;
          }
        }
      }
    }
  }
  private async showMessage() {
    const currentPage = JSON.parse(
      localStorage.getItem("__bc_panel_last_state__")
    ).p;
    const owner = currentPage.owner;
    const ownerUrl = currentPage.ownerUrl;
    const currentModule = owner == "external" ? ownerUrl : "/";
    const { Message, Errorid, Lid, Type, templateValue } =
      this.messageQueue.shift();
    let message = Message;
    let type = Type;
    let lid = Lid || 1;
    if (!(message || type)) {
      try {
        const cachedItem = this.checkErrorCode(Errorid, currentModule);
        if (cachedItem && cachedItem?.messages[lid]) {
          message = cachedItem.messages[lid];
          type = cachedItem.messageType;
        } else {
          let url;
          //@ts-ignore
          if (currentModule == "/") {
            url = HttpUtil.formatString(
              this.options.culture.generalErrorMessages,
              {
                rKey: this.options.rKey,
              }
            );
          } else {
            url = HttpUtil.formatString(
              ownerUrl + this.options.method.errorMessages,
              {
                rKey: this.options.rKey,
              }
            );
          }
          const res: any = await HttpUtil.checkRkeyFetchDataAsync(
            url,
            "GET",
            this.options.checkRkey
          );
          if (res) {
            const cachedObject =
              JSON.parse(localStorage.getItem("errorKeys")) || {};
            const cached = cachedObject[currentModule] || {};
            cached.date = new Date().getTime();

            if (cached.v != res.v) {
              cached.v = res.v;
              cached.values = {};

              res.messages.map((i) => {
                try {
                  if (i.id) {
                    cached.values[i.id] = {
                      messageType: i.messageType,
                      messages: {},
                    };
                    i.culture.map((e) => {
                      cached.values[i.id]["messages"][e.lid] = e.message;
                    });
                  }
                } catch (e) {}
              });
            }
            cachedObject[currentModule] = cached;
            localStorage.setItem("errorKeys", JSON.stringify(cachedObject));
            const found = res.messages.find((e) => e.id == Errorid);
            if (found) {
              message = found.culture.find((e) => e.lid == lid).message;
              type = found.messageType;
            } else {
              message = this.defaultMessages
                .find((e) => e.id == Errorid)
                .culture.find((e) => e.lid == lid).message;
              type = this.defaultMessages.find(
                (e) => e.id == Errorid
              ).messageType;
            }
          } else {
            message = this.defaultMessages
              .find((e) => e.id == Errorid)
              .culture.find((e) => e.lid == lid).message;
            type = this.defaultMessages.find(
              (e) => e.id == Errorid
            ).messageType;
          }
        }
      } catch (e) {
        message = this.defaultMessages
          .find((e) => e.id == Errorid)
          ?.culture?.find((e) => e.lid == lid)?.message;
        type = this.defaultMessages.find((e) => e.id == Errorid)?.messageType;
      }
    }
    if (message) {
      const newText = message.replace(/\$\{(.*?)\}/g, (match, value) => {
        if (
          templateValue &&
          Object.keys(templateValue).find((e) => e == value)
        ) {
          return templateValue[value];
        } else {
          return "";
        }
      });
      this.messageActionCases.get(type)(newText);
    }
  }
  showInfoMessage(message: string) {
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
    progress.classList.add("activeNotification");
    container.setAttribute("data-bc-message-info", "");
    container.setAttribute("data-sys-message-fade-in", "");
    setTimeout(() => {
      container.removeAttribute("data-sys-message-fade-in");
      container.setAttribute("data-sys-message-fade-out", "");
      container.removeAttribute("data-bc-message-info");
      progress.classList.remove("activeNotification");

      setTimeout(() => {
        if (this.messageQueue.length != 0) {
          this.showMessage();
        }
      }, 500);
    }, 3000);
  }
  showSuccessMessage(message: string) {
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
    progress.classList.add("activeNotification");
    container.setAttribute("data-bc-message-success", "");
    container.setAttribute("data-sys-message-fade-in", "");
    setTimeout(() => {
      container.removeAttribute("data-sys-message-fade-in");
      container.setAttribute("data-sys-message-fade-out", "");
      container.removeAttribute("data-bc-message-success");
      progress.classList.remove("activeNotification");

      setTimeout(() => {
        if (this.messageQueue.length != 0) {
          this.showMessage();
        }
      }, 500);
    }, 3000);
  }
  showErrorMessage(message: string) {
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
    setTimeout(() => {
      container.removeAttribute("data-sys-message-fade-in");
      container.setAttribute("data-sys-message-fade-out", "");
      container.removeAttribute("data-bc-message-error");

      progress.classList.remove("activeNotification");
      setTimeout(() => {
        if (this.messageQueue.length != 0) {
          this.showMessage();
        }
      }, 500);
    }, 3000);
  }
  showDefaultMessage(message: string) {
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
    progress.classList.add("activeNotification");
    container.setAttribute("data-bc-message-default", "");
    setTimeout(() => {
      container.removeAttribute("data-sys-message-fade-in");
      container.setAttribute("data-sys-message-fade-out", "");
      container.removeAttribute("data-bc-message-default");

      progress.classList.remove("activeNotification");
      setTimeout(() => {
        if (this.messageQueue.length != 0) {
          this.showMessage();
        }
      }, 500);
    }, 3000);
  }
  public async getMessageTypeByErrorId(errorid: number) {
    const currentPage = JSON.parse(
      localStorage.getItem("__bc_panel_last_state__")
    ).p;
    const owner = currentPage.owner;
    const ownerUrl = currentPage.ownerUrl;
    const currentModule = owner == "external" ? ownerUrl : "/";
    try {
      const cachedItem = this.checkErrorCode(String(errorid), currentModule);
      if (cachedItem) {
        return cachedItem.messageType;
      } else {
        let url;
        //@ts-ignore

        if (currentModule == "/") {
          url = HttpUtil.formatString(
            this.options.culture.generalErrorMessages,
            {
              rKey: this.options.rKey,
            }
          );
        } else {
          url = HttpUtil.formatString(
            ownerUrl + this.options.method.errorMessages,
            {
              rKey: this.options.rKey,
            }
          );
        }

        const res: any = await HttpUtil.checkRkeyFetchDataAsync(
          url,
          "GET",
          this.options.checkRkey
        );
        if (res) {
          const cachedObject =
            JSON.parse(localStorage.getItem("errorKeys")) || {};
          const cached = cachedObject[currentModule] || {};
          cached.date = new Date().getTime();

          if (cached.v != res.v) {
            cached.v = res.v;
            cached.values = {};

            res.messages.map((i) => {
              try {
                if (i.id) {
                  cached.values[i.id] = {
                    messageType: i.messageType,
                    messages: {},
                  };
                  i.culture.map((e) => {
                    cached.values[i.id]["messages"][e.lid] = e.message;
                  });
                }
              } catch (e) {}
            });
          }
          cachedObject[currentModule] = cached;
          localStorage.setItem("errorKeys", JSON.stringify(cachedObject));
          const found = res.messages.find((e) => e.id == errorid);
          if (found) {
            return found.messageType;
          } else {
            const message = this.defaultMessages.find((e) => e.id == errorid);
            if (message) {
              return message.messageType;
            } else {
              return null;
            }
          }
        } else {
          const message = this.defaultMessages.find((e) => e.id == errorid);
          if (message) {
            return message.messageType;
          } else {
            return null;
          }
        }
      }
    } catch (e) {
      const message = this.defaultMessages.find((e) => e.id == errorid);
      if (message) {
        return message.messageType;
      } else {
        return null;
      }
    }
  }
  public async NotificationMessageMethod(
    Errorid: string,
    Lid: number,
    Type?: number,
    Message?: string,
    templateValue?: string
  ) {
    const container =
      this.container.querySelector(".NotificationMessageMethod") ||
      this.container.querySelector(".NotificationMessageMethodMobile");
    this.messageQueue.push({ Errorid, Lid, Type, Message, templateValue });

    if (!container.hasAttribute("data-sys-message-fade-in")) {
      this.showMessage();
    }
  }
  public runAsync(source?: ISource) {
    return true;
  }
}
