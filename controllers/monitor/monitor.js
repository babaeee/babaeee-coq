import { createNode } from "../../util/dom.js";
import { g } from "../../i18n/index.js";
import css from "./monitor.css";
import { delay } from "../../util/other.js";


export const MonitorCtrl = class {
  constructor() {
    this.loading = true;
    this.setupTemplate();
    this.pprint = new FormatPrettyPrint();
  }

  async runLoadingTimer() {
    for (;;) {
      if (!this.loading) return;
      this.body.innerText += '.';
      await delay(1000);
    }
  }

  update(goals) {
    this.body.innerHTML = '';
    this.loading = false;
    this.body.dir = 'ltr';
    for (const x of this.pprint.goals2DOM(goals)) {
      this.body.appendChild(x);
    }
  }

  setupTemplate() {
    this.body = createNode('div');
    this.body.innerText = g`loading`;
    this.runLoadingTimer();
    this.el = createNode('div', css.monitor, [
      this.body,
    ]);
  }
};
