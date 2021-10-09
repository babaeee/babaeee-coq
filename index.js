import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";
import { addSentece, coqInit, coqManager, ppToDOM, subscribe } from "./util/coq/index.js";

import "./css/coq.notmodule.css";
import "./css/theme.notmodule.css";
import "./css/swal.notmodule.css";
import { delay } from "./util/other.js";
import swal from "sweetalert";
import { createNode } from "./util/dom.js";
import { libs } from "./coq/libs/manager.js";

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
  await libs.Prelude.require();
  await libs.Arith.require();
  await libs.Set.require();
  const hstring = window.localStorage.getItem('history');
  if (hstring) {
    const history = JSON.parse(hstring);
    for (const x of history) {
      await addSentece(x);
    }
  } else {
    await addSentece('Goal ~ Finite Prime');
  }
  //await addSentece('Proof. intros. classical_right.pose proof (not_and_or).pose proof (not_even).pose proof (not_odd).');
};

main();
