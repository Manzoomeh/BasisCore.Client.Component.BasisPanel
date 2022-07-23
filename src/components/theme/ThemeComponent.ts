import layout from "./assets/layout.html";
import { IUserDefineComponent, ISource } from "basiscore";
import { DefaultSource, IDictionary } from "../../type-alias";
import "./assets/style.css";
import BasisPanelChildComponent from "../BasisPanelChildComponent";
import HttpUtil from "../../HttpUtil";

export default class ThemeComponent extends BasisPanelChildComponent {
  themes: IDictionary<string>;
  defaultTheme: string;
  public initializeAsync(): Promise<void> {
    var selector = this.container.querySelector<HTMLSelectElement>(
      "[data-bc-basispanel-theme-selector]"
    );
    // Object.getOwnPropertyNames(this.themes).forEach((theme) => {
    //   selector.appendChild(new Option(theme, this.themes[theme]));
    // });

    return Promise.resolve();
  }
  public async runAsync(source?: ISource) {
    await this.getStyle();
    this.themes = {
      light: this.options.themeUrl.light,
      dark: this.options.themeUrl.dark,
    };
    const themeName = this.defaultTheme["colorMode"].split(" ")[0];
    this.setTheme(themeName);
    if (themeName == "dark") {
      this.container
        .querySelector("[data-bc-basispanel-theme-selector]")
        .setAttribute("checked", "");
    }
    this.container
      .querySelector("[data-bc-basispanel-theme-selector]")
      .addEventListener("change", async (e) => {
        const op = e.target as HTMLInputElement;

        if (op.checked) {
          this.setTheme("dark");
          const url = HttpUtil.formatString(this.options.themeUrl.addThemeUrl, {
            rKey: this.options.rKey,
          });
          await HttpUtil.sendFormData(url, "POST", `mode=dark mode`);
        } else {
          this.setTheme("light");
          const url = HttpUtil.formatString(this.options.themeUrl.addThemeUrl, {
            rKey: this.options.rKey,
          });
          await HttpUtil.sendFormData(url, "POST", `mode=light mode`);
        }
      });
  }
  constructor(owner: IUserDefineComponent) {
    super(owner, layout, "data-bc-bp-theme-container");
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
        style.setAttribute("href", path);
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
  async getStyle(): Promise<void> {
    const url = HttpUtil.formatString(this.options.themeUrl.defaultTheme, {
      rKey: this.options.rKey,
    });

    this.defaultTheme = await HttpUtil.checkRkeyFetchDataAsync(
      url,
      "GET",
      this.options.checkRkey
    );
  }
}
