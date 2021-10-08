import { isRTL } from "../../i18n/index.js";
import css from "./menu.css";

let menu;

const removeMenu = () => {
  if (!menu) return;
  menu.parentElement.removeChild(menu);
  menu = undefined;
};

document.body.addEventListener('click', () => {
  removeMenu();
});

export const createMenu = (items, ele, e) => {
  removeMenu();
  menu = document.createElement('ul');
  menu.dir = isRTL() ? 'rtl' : 'ltr';
  for (const item of items) {
    const li = document.createElement('li');
    li.innerText = item.label;
    li.onclick = item.action;
    menu.appendChild(li);
  }
  const rect = document.body.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set the position for menu
  menu.className = css.menu;
  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;

  ele.appendChild(menu);
};
