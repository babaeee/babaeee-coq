import { createNode } from "../../util/dom.js";
import { g } from "../../i18n/index.js";
import css from "./lemma.css";
import { addSentece, subscribe } from "../../util/coq/index.js";

export const LemmaCtrl = class {
  constructor() {
    this.setupTemplate();
    subscribe('lemma', (l) => this.update(l));
  }

  update(lemmas) {
    this.body.innerHTML = '';
    for (const x of lemmas) {
      const node = createNode('span', css.lemmaItem, x);
      node.addEventListener('dblclick', () => addSentece(`pose proof ${x}`));
      this.body.appendChild(node);
      this.body.appendChild(document.createTextNode(' '));
    }
  }

  setupTemplate() {
    this.body = createNode('div');
    this.el = createNode('div', css.lemma, [
      this.body,
    ]);
    this.el.dir = 'ltr';
  }
};
