import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";
import { coqInit } from "./util/coq.js";

if (isRTL()) {
  document.body.dir = 'rtl';
}

const main = async () => {
  await coqInit();
  console.log('pp', new FormatPrettyPrint());
  const root = new RootCtrl();
  document.body.appendChild(root.el);
};

main();
