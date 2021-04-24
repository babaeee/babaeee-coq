import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";
import { addSentece, coqInit, coqManager, ppToDOM, subscribe } from "./util/coq/index.js";

import "./css/coq.notmodule.css";
import "./css/theme.notmodule.css";
import "./css/swal.notmodule.css";
import { delay } from "./util/other.js";
import swal from "sweetalert";
import { createNode } from "./util/dom.js";

if (isRTL()) {
  document.body.dir = 'rtl';
}

const main = async () => {
  coqInit();
  subscribe('exn', async (pp) => {
    const c = createNode('div');
    for (const x of ppToDOM(pp)) {
      c.appendChild(x);
    }
    await swal({
      content: c,
      icon: 'error',
    });
  });
  const root = new RootCtrl();
  document.body.appendChild(root.el);
  await coqInit();
  await addSentece('Goal ((3 < 100) -> (forall a b: nat, a < b -> 2 * a < 2 * b) -> 2 * 3 < 2 * 100).');
  await addSentece('intros.');
};

main();
