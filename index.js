import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";
import { addSentece, coqInit, coqManager } from "./util/coq.js";

import "./css/coq.notmodule.css";
import "./css/theme.notmodule.css";
import { delay } from "./util/other.js";

if (isRTL()) {
  document.body.dir = 'rtl';
}

const main = async () => {
  await coqInit();
  console.log('pp', new FormatPrettyPrint());
  const root = new RootCtrl();
  document.body.appendChild(root.el);
  await root.initCoq();
  await addSentece(root.coq, 'Goal ((3 < 100) -> (forall a b: nat, a < b -> 2 * a < 2 * b) -> 2 * 3 < 2 * 100).');
  await addSentece(root.coq, 'intros.');
};

main();
