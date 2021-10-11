/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ 27:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(537);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "[bc-tab-active-component =\"false\"]{display: none;}\r\n[bc-tab-header-wrapper]{display: flex;background: #fff;\r\n\theight: 35px;width: 80%; background: #fff;}\r\n[bc-tab-close-button]{border: none; background: none;}\r\n[bc-tab-header]{border-left: 1px solid var(--light_gray);padding: 5px 10px;\r\nmargin-left: 1px;}\r\n[bc-tab-close-button]{margin-right: 5px;}\r\n[bc-tab-header]{cursor: pointer;}", "",{"version":3,"sources":["webpack://./src/asset/style.css"],"names":[],"mappings":"AAAA,mCAAmC,aAAa,CAAC;AACjD,wBAAwB,aAAa,CAAC,gBAAgB;CACrD,YAAY,CAAC,UAAU,EAAE,gBAAgB,CAAC;AAC3C,sBAAsB,YAAY,EAAE,gBAAgB,CAAC;AACrD,gBAAgB,wCAAwC,CAAC,iBAAiB;AAC1E,gBAAgB,CAAC;AACjB,sBAAsB,iBAAiB,CAAC;AACxC,gBAAgB,eAAe,CAAC","sourcesContent":["[bc-tab-active-component =\"false\"]{display: none;}\r\n[bc-tab-header-wrapper]{display: flex;background: #fff;\r\n\theight: 35px;width: 80%; background: #fff;}\r\n[bc-tab-close-button]{border: none; background: none;}\r\n[bc-tab-header]{border-left: 1px solid var(--light_gray);padding: 5px 10px;\r\nmargin-left: 1px;}\r\n[bc-tab-close-button]{margin-right: 5px;}\r\n[bc-tab-header]{cursor: pointer;}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 537:
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ 283:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(379);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(795);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(569);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(565);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(216);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(589);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* .default.locals */ .Z.locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* .default.locals */ .Z.locals : undefined);


/***/ }),

/***/ 379:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ BasisPanelChildComponent)
/* harmony export */ });
// import IBasisPanelOptions from "./src/basispanel/IBasisPanelOptions";
class BasisPanelChildComponent {
    // protected readonly options: IBasisPanelOptions;
    constructor(owner, layout, dataAttr) {
        this.owner = owner;
        this.container = document.createElement("div");
        this.container.setAttribute(dataAttr, "");
        this.owner.setContent(this.container);
        if ((layout === null || layout === void 0 ? void 0 : layout.length) > 0) {
            const range = new Range();
            range.setStart(this.container, 0);
            range.setEnd(this.container, 0);
            range.insertNode(range.createContextualFragment(layout));
        }
        // this.options = this.owner.getSetting<IBasisPanelOptions>(
        //   "basispanel.option",
        //   null
        // );
    }
}


/***/ }),

/***/ 324:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ TabComponent)
/* harmony export */ });
/* harmony import */ var _src_widget1_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(104);
/* harmony import */ var _src_BasisPanelChildComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(625);
/* harmony import */ var _asset_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(283);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class TabComponent extends _src_BasisPanelChildComponent__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z {
    constructor(owner) {
        super(owner, _src_widget1_html__WEBPACK_IMPORTED_MODULE_0__, "bc-tab-container");
        this.tabNodes = [];
        this.firstTabInitialize = false;
    }
    createBody() {
        return __awaiter(this, void 0, void 0, function* () {
            //comment this
            let triggersArray = [];
            const firstTab = this.tabComponentOptions.find(element => element.active == true);
            const componentId = Math.floor(Math.random() * 10000);
            this.headerWrapper = document.createElement("div");
            this.headerWrapper.setAttribute("bc-tab-header-wrapper", "");
            this.headerWrapper.appendChild(this.createHeader(firstTab.title, componentId, 1));
            this.container.appendChild(this.headerWrapper);
            let basisElement = document.createElement("basis");
            basisElement.setAttribute("core", "call");
            basisElement.setAttribute("file", `${firstTab.widgetId}.html`);
            basisElement.setAttribute("run", "atclient");
            yield this.initializeComponent(basisElement, componentId);
            for (var i = 0; i < this.tabComponentOptions.length; i++) {
                if (this.tabComponentOptions[i].triggers.length > 0) {
                    triggersArray.push(this.tabComponentOptions[i].triggers[0]);
                }
            }
            this.owner.addTrigger(triggersArray);
        });
    }
    createHeader(headerText, id, firstTab = 0) {
        const header = document.createElement("div");
        const closeBtn = document.createElement("button");
        const span = document.createElement("span");
        header.setAttribute("bc-tab-header", "");
        span.setAttribute("data-id", id.toString());
        closeBtn.setAttribute("data-id", id.toString());
        span.textContent = headerText;
        closeBtn.textContent = "x";
        closeBtn.setAttribute("bc-tab-close-button", "");
        header.appendChild(span);
        if (firstTab == 0) {
            header.appendChild(closeBtn);
        }
        this.activeHeader = header;
        closeBtn.addEventListener("click", (e) => {
            const closeElement = e.target;
            const headerElement = closeElement.getAttribute("data-id");
            const header = closeElement.parentElement;
            this.tabNodes.map(x => {
                let dataId = x.getAttribute("data-id");
                if (parseInt(dataId) == parseInt(headerElement)) {
                    this.activeComponent = x;
                    this.activeHeader = header;
                }
            });
            this.activeComponent.remove();
            this.activeHeader.remove();
            this.activeTab(this.tabNodes[0]);
        });
        span.addEventListener("click", (e) => {
            const headerElement = e.target;
            const headerId = headerElement.getAttribute("data-id");
            this.tabNodes.map(x => {
                const componentId = x.getAttribute("component-id");
                if (parseInt(headerId) == parseInt(componentId)) {
                    this.activeTab(x);
                }
            });
        });
        return header;
    }
    initializeComponent(activeComponent, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let componentWrapper = document.createElement("div");
            componentWrapper.appendChild(activeComponent);
            componentWrapper.setAttribute("bc-tab-component-wrapper", "");
            componentWrapper.setAttribute("component-id", id.toString());
            this.container.appendChild(componentWrapper);
            this.tabNodes.push(componentWrapper);
            this.activeComponent = componentWrapper;
            this.tabNodes.map(x => {
                x.setAttribute("bc-tab-active-component", "false");
            });
            this.activeComponent.setAttribute("bc-tab-active-component", "true");
            //const nodes= Array.from(this.container.childNodes)
            //this.owner.setContent(this.container);    
            yield this.owner.processNodesAsync([activeComponent]);
        });
    }
    activeTab(activeComponent) {
        this.tabNodes.map(x => {
            x.setAttribute("bc-tab-active-component", "false");
        });
        activeComponent.setAttribute("bc-tab-active-component", "true");
        this.activeComponent = activeComponent;
    }
    runAsync(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.firstTabInitialize) {
                yield this.createBody();
                this.firstTabInitialize = true;
            }
            else if (source) {
                const componentId = Math.floor(Math.random() * 10000);
                const activeTab = this.tabComponentOptions.find(element => element.triggers.find(element1 => element1 == source._id));
                this.headerWrapper.appendChild(this.createHeader(activeTab.title, componentId));
                const basisOptions = `{"settings": {"connection.web.fingerfoodapii": "https://dbsource.basiscore.net/data.json"}}`;
                let groupElement = document.createElement("basis");
                groupElement.setAttribute("core", "group");
                groupElement.setAttribute("run", "atclient");
                let tabSettings = `${this.tabsSettings}`;
                groupElement.setAttribute("options", JSON.stringify(basisOptions));
                let basisTag = document.createElement("basis");
                basisTag.setAttribute("core", "call");
                basisTag.setAttribute("file", `${activeTab.widgetId}.html`);
                basisTag.setAttribute("run", "atclient");
                groupElement.appendChild(basisTag);
                yield this.initializeComponent(groupElement, componentId);
            }
            return true;
        });
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const settingObject = yield this.owner.getAttributeValueAsync("options");
            this.tabComponentOptions = eval(settingObject).tabs;
            this.tabsSettings = eval(settingObject).tabSettings;
        });
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getOptions();
        });
    }
}


/***/ }),

/***/ 104:
/***/ ((module) => {

"use strict";
module.exports = "<div></div>";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tabManager": () => (/* binding */ tabManager)
/* harmony export */ });
/* harmony import */ var _TabManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(324);

// const obj = new DemoClass("Hello World");
// obj.logMessage();
// obj.alertMessage();
// obj.setContent(document.getElementById('container'))
const tabManager = _TabManager__WEBPACK_IMPORTED_MODULE_0__/* .default */ .Z;


})();

bc = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=basiscore.tabManager.js.map