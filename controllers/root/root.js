import { createNode } from "../../util/dom.js";
import { g, changeLang } from "../../i18n/index.js";
import css from "./root.css";

export const RootCtrl = class {
  constructor() {
    this.setupTemplate();
  }

  setupTemplate() {
    this.el = createNode('div', '', [
      createNode('h1', css.title, g`babaeee_coq`),
      createNode('br'),
      createNode('button', {
        onclick: () => {
          changeLang();
        },
        className: css.changeLangButton,
      }, g`change_lang`),
    ]);
  }
};
