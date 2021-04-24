import { createNode } from "../../util/dom.js";
import { g } from "../../i18n/index.js";
import css from "./history.css";
import { subscribe } from "../../util/coq/index.js";

export const HistoryCtrl = class {
  constructor() {
    this.setupTemplate();
    subscribe('history', (history) => this.update(history));
  }

  update(history) {
    this.body.innerHTML = '';
    for (const x of history) {
      this.body.appendChild(createNode('li', {}, x));
    }
  }

  setupTemplate() {
    this.body = createNode('ul');
    this.el = createNode('div', css.history, [
      this.body,
    ]);
    this.el.dir = 'ltr';
  }
};
