import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";

if (isRTL()) {
  document.body.dir = 'rtl';
}

const root = new RootCtrl();
document.body.appendChild(root.el);
