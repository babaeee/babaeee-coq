import { createNode } from "../../util/dom.js";
import { g, changeLang } from "../../i18n/index.js";
import css from "./toolbar.css";
import { addSentece } from "../../util/coq/index.js";

export const ToolbarCtrl = class {
  constructor(parent) {
    this.parent = parent;
    this.setupTemplate();
  }

  setupTemplate() {
    this.el = createNode("div", css.toolContain, [
      createNode("button", {
        className: css.toolButton,
        onclick: async () => {
          const s = window.prompt('Your sentence:');
          await addSentece(s);
        },
      }, "1"),
      createNode("button", css.toolButton, "2"),
      createNode("button", css.toolButton, "3"),
      createNode("button", css.toolButton, "4"),
      createNode("button", css.toolButton, "5"),
      createNode("button", css.toolButton, "6"),
      createNode("button", css.toolButton, "7"),
      createNode("button", css.toolButton, "8"),
      createNode("button", css.toolButton, "9"),
    ]);
  }
};
