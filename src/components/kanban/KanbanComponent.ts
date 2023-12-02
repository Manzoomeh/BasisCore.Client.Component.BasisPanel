import { IDependencyContainer, ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout.html";
import "./assets/style.css";
import HttpUtil from "../../HttpUtil";
import NotificationMessageComponent from "../notificationMessage/NotificationMessageComponent";
class RelationResponse {
  message: string;
  errorid: number;
  id: number;
}
export default class KanbanComponent extends BasisPanelChildComponent {
  public options;
  public columns;
  public issues;
  public users;
  public table1: string;
  public table2: string;
  public searchValue: string;
  public selectedUser: string;
  public message: NotificationMessageComponent;

  public container: Element;

  constructor(owner: IUserDefineComponent, options) {
    super(owner, desktopLayout, desktopLayout, "data-bc-bp-kanban-container");
    this.owner.dc
      .resolve<IDependencyContainer>("parent.dc")
      .registerInstance("kanban", this);
    this.message =
      this.owner.dc.resolve<NotificationMessageComponent>("message");
    this.options = options;
    this.container = document.querySelector("[data-bc-bp-kanban-container]");
  }

  public async initializeAsync(): Promise<void> {
    const options = await this.owner.getAttributeValueAsync("options");
    const option = options ? eval(options) : null;
    this.options = option;
    this.columns = await this.getColumnsAsync();
    this.issues = await this.getIssuesAsync();
    this.users = await this.getUseresAsync();
    this.container
      .querySelector("[data-bc-kanban-search]")
      .addEventListener("input", (e: any) => {
        this.searchValue = e.target.value;
        this.createSections();
      });
    this.createUI();
    return Promise.resolve();
  }
  dragOver(e) {
    e.preventDefault();
  }

  dragStart(e) {
    this.table1 = e.srcElement.getAttribute("data-id");
  }

  dragDrop(e) {
    this.table2 = e.srcElement.closest(".sprint").getAttribute("data-cid");
    this.issues[
      this.issues.indexOf(this.issues.find((e) => e.issueid == this.table1))
    ].statusid = this.table2;
    this.createSections();
    this.syncRelationAsync();
  }

  public runAsync(source?: ISource) {
    return true;
  }
  private formatTemplate(template: string, issue) {
    const regex = /\{(\s*?\w+\s*?)\}/g;
    return template.replace(regex, (match, key) => {
      return issue[key.trim()] ?? "";
    });
  }
  protected onUserClick(id): void {
    this.selectedUser = String(id.value);
    this.createSections();
  }
  protected showAll(): void {
    this.selectedUser = "";
    this.createSections();
  }
  protected createSections(): void {
    const columnsContainer = this.container.querySelector(
      "[data-bc-columns-container]"
    );
    columnsContainer.innerHTML = "";
    columnsContainer.innerHTML = this.columns.map((e) => {
      return `<section class="sprint column" id="div1" data-cid="${
        e.id
      }" data-title="${e.statustitle}">
        <div class="sprintcontentDetail" style="border-bottom: 4px solid ${
          e.color
        };">
        <h2>${e.statustitle}</h2>
        </div>
        <div class="activesprintdatas" id="drag1"  >
        ${this.getFilteredIssues()
          .filter((i) => i.statusid == e.id)
          .map((c) => this.formatTemplate(this.options.issuetemplate, c))}
        
        </div>
        
        </section>`;
    });
    const items = document.querySelectorAll(".item");

    items.forEach((item) => {
      item.addEventListener("click", function () {});
      item.addEventListener("dragstart", (e) => this.dragStart(e));
      item.addEventListener("dragend", function (e) {});
    });
    var columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
      column.addEventListener("dragover", (e) => this.dragOver(e));
      column.addEventListener("drop", (e) => this.dragDrop(e));
    });
  }
  protected createUI(): void {
    document.getElementById("KanbanLoadingWrapper").style.display = "none";
    (
      document.querySelector("[data-bc-kanban-container]") as HTMLElement
    ).style.display = "block";
    const iconsContainer = this.container.querySelector("[data-bc-user-icons]");

    iconsContainer.innerHTML =
      this.users
        .map(
          (e, i) =>
            `<img src="https://basispanel.ir/panel/${this.options.rkey}/users/${
              e.avatar
            }" class='userImage'style='z-index:${i};right:${
              i * 30 + 30
            }px;border-radius:20%;margin-inline-start:-10px' user-id='${
              e.userid
            }'/>`
        )
        .join("") +
      `<div data-bc-show-all=''> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clip-path="url(#clip0_3899_91133)">
        <path d="M16.5 12C17.88 12 18.99 10.88 18.99 9.5C18.99 8.12 17.88 7 16.5 7C15.12 7 14 8.12 14 9.5C14 10.88 15.12 12 16.5 12ZM9 11C10.66 11 11.99 9.66 11.99 8C11.99 6.34 10.66 5 9 5C7.34 5 6 6.34 6 8C6 9.66 7.34 11 9 11ZM16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14ZM9 13C6.67 13 2 14.17 2 16.5V19H9V16.75C9 15.9 9.33 14.41 11.37 13.28C10.5 13.1 9.66 13 9 13Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_3899_91133">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg></div>`;
    this.container.querySelectorAll(".userImage").forEach((e) => {
      e.addEventListener("click", () => {
        this.onUserClick(e.attributes["user-id"]);
      });
    });
    this.container
      .querySelector("[data-bc-show-all]")
      .addEventListener("click", () => {
        this.showAll();
      });
    this.createSections();
  }
  protected getFilteredIssues(): any[] {
    let temp = [];
    if (this.selectedUser) {
      temp = this.issues.filter((e) => e.user == this.selectedUser);
    } else {
      temp = this.issues;
    }
    if (this.searchValue) {
      temp = temp.filter((e) => e.issuetitle.search(this.searchValue) !== -1);
    }
    return temp;
  }
  protected async syncRelationAsync(): Promise<void> {
    try {
      const res = await fetch(this.options.relation, {
        method: "post",
        body: JSON.stringify({
          table1: this.table1,
          table2: this.table2,
        }),
      });
      const json: RelationResponse = await res.json();
      if (json.message == "successful") {
        this.message.showMessage("success", "تغییرات با موفقیت ثبت شد");
      }
    } catch {}
  }
  protected async getUseresAsync(): Promise<Array<object>> {
    const users = new Set();
    for (const obj of this.issues) {
      users.add(obj["user"]);
    }
    const userArray = Array.from(users);
    const data = await fetch(this.options.users, {
      method: "POST",
      body: JSON.stringify({ userid: userArray }),
    });
    const userList = await data.json();
    return userList;
  }
  protected getColumnsWithUrlAsync(): Promise<Array<object>> {
    return HttpUtil.checkRkeyFetchDataAsync<Array<any>>(
      this.options.columns,
      "GET",
      this.options.checkRkey
    );
  }
  protected async getColumnsWithDBSourceAsync(): Promise<Array<object>> {
    const formData = new FormData();

    // Append form data
    formData.append("command", this.options.columns);
    const data = await fetch(this.options.api, {
      method: "POST",
      body: formData,
    });
    const res = await data.json();
    return res.sources[0].data;
  }
  protected async getColumnsAsync(): Promise<Array<object>> {
    if (this.options.columns.search("<basis") == -1) {
      return this.getColumnsWithUrlAsync();
    } else {
      return await this.getColumnsWithDBSourceAsync();
    }
  }
  protected getIssuesWithUrlAsync(): Promise<Array<object>> {
    return HttpUtil.checkRkeyFetchDataAsync<Array<any>>(
      this.options.issues,
      "GET",
      this.options.checkRkey
    );
  }
  protected async getIssuesWithDBSourceAsync(): Promise<Array<object>> {
    const formData = new FormData();

    // Append form data
    formData.append("command", this.options.issues);
    const data = await fetch(this.options.api, {
      method: "POST",
      body: formData,
    });
    const res = await data.json();
    return res.sources[0].data;
  }
  protected async getIssuesAsync(): Promise<Array<object>> {
    if (this.options.issues.search("<basis") == -1) {
      return this.getIssuesWithUrlAsync();
    } else {
      return await this.getIssuesWithDBSourceAsync();
    }
  }
}
