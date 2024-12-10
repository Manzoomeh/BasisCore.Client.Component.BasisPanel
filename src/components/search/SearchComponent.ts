import { BCWrapperFactory, ISource, IUserDefineComponent } from "basiscore";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import desktopLayout from "./assets/layout-desktop.html";
import "./assets/style.css";
import "./assets/style-desktop.css";
import HttpUtil from "../../HttpUtil";
import IPageLoaderParam from "../menu/IPageLoaderParam";
import {
  DefaultSource,
  PanelLevels,
} from "../../type-alias";
import LocalStorageUtil from "../../LocalStorageUtil";

declare const $bc: BCWrapperFactory;
// this component is on  MPV version and nedd to develope smarter than it. Qadireh
export default class WidgetListComponent extends BasisPanelChildComponent {
  protected element: Element;
  private selectedModuleId :number 
  private selectedApi :string 
  private selectedMethod 
  private selectedBody : object[]
  private freeze : boolean = false
  private selectedPageId :number 
  private selectedLevel : PanelLevels
  private selectedModuleName : string
  private selectedModuleURL : string
  private outputkey : string
  private selectedApiType : string
  private selectedArgs : object
  constructor(owner: IUserDefineComponent) {
    super(
      owner,
      desktopLayout,
      desktopLayout,
      "data-bc-bp-widget-list-container"
    );
  }



  public async initializeAsync(): Promise<void> {

    this.initSearchCategories()
    this.searchText()
    this.element = this.container.querySelector<Element>("[data-bc-main-list]");
    // const elClick = this.element.closest("[data-bc-search-list-container]").querySelector("[data-bc-main-list-click]");
    const elClicks = this.element
      .closest("[data-bc-search-list-container]")
      .querySelectorAll("[data-bc-drop-down-click]");

    elClicks.forEach((elClick) => {
      elClick.addEventListener("click", async (e) => {
        //On dropdown array bottom click
      
        const elStatus = this.element.closest("[data-bc-drop-down-container]");
        const status = elStatus.getAttribute("data-status");
        if (status == "close") {
          elStatus.setAttribute("data-status", "open");
        } else {
          elStatus.setAttribute("data-status", "close");
        }

        // 
        const elStatusSearch = this.element.closest("[data-bc-drop-down-container1]");
        elStatusSearch?.setAttribute("data-status", "close");
       
      });
    });


  
    return Promise.resolve();
  }
  private selectModule (el , moduleid, api,method,body,pageid, level , modulename , moduleurl, output,type){
    const searchLabel = el.closest("[data-bc-search-list-container]").querySelector("[data-bc-search-msg]")
    searchLabel.textContent = el.getAttribute("data-search-title")
    const searchInput:HTMLInputElement = el.closest("[data-bc-search-list-container]").querySelector("[data-bc-search-input-text]") 
    searchInput.setAttribute("data-bc-search-input-text-show","")
    searchInput.focus()
    searchInput.value = ""
    searchLabel.setAttribute("data-bc-search-lable","")
    this.selectedModuleId = moduleid
    this.selectedApi = api
    this.selectedMethod = method
    this.selectedBody = body
    this.selectedPageId = parseInt(pageid)
    this.selectedLevel = level
    this.selectedModuleName = modulename
    this.selectedModuleURL = moduleurl
    this.outputkey = output
    this.selectedApiType  = output
    this.selectedApiType = type
    const elStatus = el.closest("[data-bc-drop-down-container]");
    const status = elStatus.getAttribute("data-status");
    if (status == "close") {
      elStatus.setAttribute("data-status", "open");
    } else {
      elStatus.setAttribute("data-status", "close");
    }
    
  }
  public async runAsync(source?: ISource): Promise<any> {
    // switch (source?.id) {
  
    // }
    return 
  }


private initSearchCategories(){
  this.element = this.container.querySelector<Element>("[data-bc-search-category-all]");
  this.options.search.forEach(e => {
    const itemCategory = document.createElement("li")
    const itemCategoryTitle = document.createElement("span")
    const itemCategoryIcon = document.createElement("span")
    itemCategoryIcon.setAttribute("data-bc-item-category-icon", "")
    itemCategoryTitle.textContent = e.title
    itemCategoryIcon.innerHTML = e.icon
    itemCategory.appendChild(itemCategoryIcon)
    itemCategory.appendChild(itemCategoryTitle)
    itemCategory.setAttribute("data-search-title", e.title)
    itemCategory.setAttribute("data-moduleid", e.module.id.toString())
    
    itemCategory.addEventListener("click", el =>{
      this.selectModule(itemCategory, e.module.id , e.api , e.method , e.body , e.pageid , e.level , e.module.name, e.module.url, e.outputKey, e.type);
    } )
    this.element.appendChild(itemCategory)
  })
}

  searchText(){
  const searchInput = this.container.querySelector<Element>("[data-bc-search-input-text]") ;
   searchInput.addEventListener("keyup" , async (e) => {
    
    const op = e.target as HTMLInputElement;
    const searchVal = op.value
    if(searchVal.length >=3){
      
        const result =await this.searchParam(searchVal)
        const items = this.container.querySelector("[data-bc-main-search-list]")
        const elStatus1 = this.container.querySelector("[data-bc-drop-down-container1]");
        const status1 = elStatus1.getAttribute("data-status");
        items.innerHTML = ""
        if(result){
      if(result["sources"][0].data.length > 0){
        
        result["sources"][0].data.forEach(data => {
          const searchResultLi = document.createElement("li")
          searchResultLi.textContent = data[this.outputkey]	

          if(this.selectedModuleId == 17){
            searchResultLi.setAttribute("data-id",  data.wordid_4514	) 
            searchResultLi.setAttribute("data-title",  data.wordid_23		) 
            searchResultLi.setAttribute("data-schemaid",  data.schemaid		) 
            if( data.wordid_4619	){
              searchResultLi.setAttribute("data-ownerid",  data.wordid_4619	) 
            }
          }
          if(this.selectedModuleId == 1){
            searchResultLi.setAttribute("data-id",  data.usedforid	) 
            searchResultLi.setAttribute("data-mid",  data.mid		) 
            searchResultLi.setAttribute("data-hashid",  data.hashid		) 
            if( data.wordid_4619	){
              searchResultLi.setAttribute("data-ownerid",  data.wordid_4619	) 
            }
          }
        

          searchResultLi.addEventListener("click" , searchEl => {
            this.selectItemSearch(searchEl)
          })
          items.appendChild(searchResultLi)
        })
        
        if (status1 == "close") {
          elStatus1.setAttribute("data-status", "open");
        } 
        this.container.querySelector("[data-bc-drop-down-container1]").appendChild(items)
        this.freeze = false
      }
      else{
        items.innerHTML = ""
        if (status1 == "close") {
          elStatus1.setAttribute("data-status", "open");
          const searchResultLi = document.createElement("li")
          searchResultLi.textContent = "نتیجه‌ای یافت نشد"
          items.appendChild(searchResultLi)
        } 
        this.freeze = false
      }
    }
    
  
    }
  })
}
async searchParam(val){
  if(this.freeze == false){
    this.freeze = true
    const url = HttpUtil.formatString(this.selectedApi, {
      rKey: this.options.rKey,
    });
    if(this.selectedApiType == "json"){
      const body = HttpUtil.formatString(JSON.stringify(this.selectedBody),{
        term : val
      })
      const result = await HttpUtil.checkRkeyFetchDataAsync(
        url,
        this.selectedMethod,
        this.options.checkRkey,
        JSON.parse(body)
      );
      return result
    }
    else{
      let formData:string = ""
      this.selectedBody.forEach(e => {
        formData += `${e["key"]}=${    HttpUtil.formatString(JSON.stringify(e["value"]),{
          term : val,
          rkey : this.options.rKey
        })   }`
      })
      const result =  await HttpUtil.sendFormData(url, "POST", formData);
      return result
    }
  
    
  }
 
  
}
  private async getCurrentService() {

    const result = await LocalStorageUtil.checkRkeyResult;
    return result;
  }
async selectItemSearch(el){  
  const checkkrkeyInfo = await this.getCurrentService();
  if(this.selectedModuleId == 17 && el.target.getAttribute("data-ownerid")){
    
    this.selectedArgs = {
      listPageId: 30,
      id:parseInt(el.target.getAttribute("data-id")),
      schemaid: parseInt(el.target.getAttribute("data-schemaid")),
      type: 2,
      ownerid :  parseInt(el.target.getAttribute("data-ownerid")),
      title: el.target.getAttribute("data-title")
    }
    this.selectedPageId = 29
  }
  else if(this.selectedModuleId == 17 && !el.target.getAttribute("data-ownerid")){
    
    this.selectedArgs = {
      listPageId: 30,
      id: el.target.getAttribute("data-id"),
      schemaid: el.target.getAttribute("data-schemaid"),
      type: 1,
      title: el.target.getAttribute("data-title")
    }
    this.selectedPageId = 39
  }
  else if(this.selectedModuleId == 1 && el.target.getAttribute("data-mid") == 1 ){
    this.selectedArgs ={
      listpageid: 5,
      pageid: "16",
      hashid: el.target.getAttribute("data-hashid"),
      id: el.target.getAttribute("data-id"),
      lid: "1",
      culture: "fa",
      mid: "1",
      parentid: 0,
      
    }
    this.selectedPageId = 16

    
  }
  else if(this.selectedModuleId == 1 && el.target.getAttribute("data-mid") == 20 ){
    this.selectedArgs ={
      listpageid: 5,
      pageid: "15",
      hashid: el.target.getAttribute("data-hashid"),
      id: el.target.getAttribute("data-id"),
      lid: "1",
      culture: "fa",
      mid: "1",
      parentid: 0,
      
    }
    this.selectedPageId = 15

    
  }
  else if(this.selectedModuleId == 1 && el.target.getAttribute("data-mid") == 19 ){
    this.selectedArgs ={
      listpageid: 5,
      pageid: "17",
      hashid: el.target.getAttribute("data-hashid"),
      id: el.target.getAttribute("data-id"),
      lid: "1",
      culture: "fa",
      mid: "1",
      parentid: 0,
      
    }
    this.selectedPageId = 17

    
  }
  const newParam: IPageLoaderParam = {
    level: this.selectedLevel,
    pageId: this.selectedPageId,
    levelId: checkkrkeyInfo.currentOwnerid,
    moduleId: this.selectedModuleId,
    moduleName: this.selectedModuleName,
    moduleUrl: this.selectedModuleURL,
    rKey: this.options.rKey,
    arguments: this.selectedArgs,
    isSilent: false,
  };
  this.owner.setSource(DefaultSource.DISPLAY_PAGE, newParam);
  const elStatus1 = this.container.querySelector("[data-bc-drop-down-container1]");
  const status1 = elStatus1.getAttribute("data-status");
  if (status1 == "open") {
    elStatus1.setAttribute("data-status", "close");
  } 
}
}
