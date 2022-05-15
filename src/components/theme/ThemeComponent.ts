import layout from "./assets/layout.html";
import { IUserDefineComponent, ISource } from "basiscore";
import { DefaultSource, IDictionary } from "../../type-alias";
import "./assets/style.css";
import BasisPanelChildComponent from "../BasisPanelChildComponent";

export default class ThemeComponent extends BasisPanelChildComponent {
  themes: IDictionary<string>;
  public initializeAsync(): Promise<void> {
    var selector = this.container.querySelector<HTMLSelectElement>(
      "[data-bc-basispanel-theme-selector]"
    );
    // Object.getOwnPropertyNames(this.themes).forEach((theme) => {
    //   selector.appendChild(new Option(theme, this.themes[theme]));
    // });
    return Promise.resolve();
  }
  public runAsync(source?: ISource) {}
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-theme-container");
    this.themes = {      
      light: this.options.themeUrl.light,
      dark: this.options.themeUrl.dark
    };
    
    var style = document.querySelector("link[data-bc-basispanel-theme]");
    style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css");
        style.setAttribute("data-bc-basispanel-theme", "light");
        style.setAttribute("href", this.options.themeUrl.light);
        document.body.appendChild(style);
    this.container
      .querySelector("[data-bc-basispanel-theme-selector]")
      .addEventListener("change", (e) => {
        const op = e.target as HTMLInputElement;
        if(op.checked){
          this.setTheme("dark");
        }
        else{
          this.setTheme("light");
        }
        
      });
  }

  private setTheme(theme: string): boolean {
    const path = this.themes[theme];
    let ret_val = false;
    if (path) {
      var style = document.querySelector("link[data-bc-basispanel-theme]");
      if (!style) {
        style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("type", "text/css");
        style.setAttribute("data-bc-basispanel-theme", theme);
        style.setAttribute("href", this.options.themeUrl.light);
        document.body.appendChild(style);
        ret_val = true;
      } else {
        const currentTheme = style.getAttribute("data-bc-basispanel-theme");
        if (currentTheme != theme) {
          style.setAttribute("data-bc-basispanel-theme", theme);
          style.setAttribute("href", path);
          ret_val = true;
        }
      }
    }
    if (ret_val) {
      var context = this.owner.dc.resolve<any>("parent.context");
      context.setAsSource(DefaultSource.THEME_CHANGE, {
        name: theme,
        path: path,
      });
    }
    return ret_val;
  }
}
