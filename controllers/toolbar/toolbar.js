import { createNode } from "../../util/dom.js";
import { g, changeLang } from "../../i18n/index.js";
import css from "./toolbar.css";


export const ToolbarCtrl = class {
  constructor() {
    this.setupTemplate();
  }

  setupTemplate() {
    this.el = createNode('div', '', [
      createNode('button', css.toolButton , 'button1'),
      createNode('button',css.toolButton ,'button2'),
      createNode('button',css.toolButton,'button3'),
    ]);
  }
};
