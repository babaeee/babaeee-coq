import { createNode } from "../../util/dom.js";
import { g, changeLang } from "../../i18n/index.js";
import { ToolbarCtrl } from "../toolbar/toolbar.js";
import css from "./root.css";

export const RootCtrl = class {
  constructor() {
    this.toolchild = new ToolbarCtrl();
    this.setupTemplate();
  }

  setupTemplate() {
    this.el = createNode('div', css.discription, [
      createNode('h1', css.title, g`babaeee_coq`),
      this.toolchild.el,
      createNode('button', {
        onclick: () => {
          changeLang();
        },
        className: css.changeLangButton,
      }, g`change_lang`),
    ]);
  }
};
