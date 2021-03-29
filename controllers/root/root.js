import { createNode } from "../../util/dom.js";
import { g, changeLang } from "../../i18n/index.js";
import { ToolbarCtrl } from "../toolbar/toolbar.js";
import { MonitorCtrl } from "../monitor/monitor.js";
import css from "./root.css";
import { coqManager } from "../../util/coq.js";

export const RootCtrl = class {
  constructor() {
    this.toolbar = new ToolbarCtrl();
    this.monitor = new MonitorCtrl();
    this.setupTemplate();
  }

  async initCoq() {
    this.coq = await coqManager({
      onNewGoal: (goal) => {
        this.monitor.update(goal);
      },
    });
  }

  setupTemplate() {
    document.title = g`babaeee_coq`;
    this.el = createNode('div', css.main, [
      createNode('h1', css.title, [
        createNode('span', '', g`babaeee_coq`),
        createNode('button', {
          onclick: () => {
            changeLang();
          },
          className: css.changeLangButton,
        }, g`change_lang`),
      ]),
      createNode('div', css.bottomContainer, [
        this.toolbar.el,
        this.monitor.el,
      ]),
    ]);
  }
};
