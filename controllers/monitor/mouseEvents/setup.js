import interact from 'interactjs';
import { addSentece } from "../../../util/coq/index.js";
import $ from "jquery";
import cssLemma from "../../lemma/lemma.css";
import { createMenu } from '../../../util/contextMenu/menu.js';
import { g } from '../../../i18n/index.js';

const recursiveClass = (elem) => {
  const tag = elem.className;
  const children = [...elem.children].map(recursiveClass);
  if (children.length === 0) {
    return { tag, text: elem.innerText };
  }
  return { tag, children };
};

const parseElem = (elem) => {
  let l = elem.querySelector('label');
  if (l != null) {
    return {
      type: 'hyp',
      label: l.innerText,
    };
  }
  return { type: 'goal', tree: recursiveClass(elem) };
};

let dragDropInited = false;

const setupDragDrop = () => {
  if (dragDropInited) {
    return;
  }
  dragDropInited = true;
  interact('.' + cssLemma.lemmaItem)
  .draggable({
    onmove: function(event) {
      const target = event.target;

      const dataX = target.getAttribute('data-x');
      const dataY = target.getAttribute('data-y');
      const initialX = parseFloat(dataX) || 0;
      const initialY = parseFloat(dataY) || 0;

      const deltaX = event.dx;
      const deltaY = event.dy;

      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      $('.coq-env > div')
        .css('border', '1.5px dashed #ffffffaa');
      $(target).css({
        'transform': `translateY(${newY}px) scale(1.02)`,
        'box-shadow': '0px 0px 20px 6px #ffffff40',
        'border': '',
        'transition': ''
      });

      target.setAttribute('data-x', newX);
      target.setAttribute('data-y', newY);
    },
    onend: function(event) {
      const target = event.target;
      $('.coq-env > div').css('border', '');
      $(target).css({
        'transition': '.5s all',
        'transform': '',
        'box-shadow': ''
      });
      target.removeAttribute('data-x');
      target.removeAttribute('data-y');
    }
  });
  interact('.coq-env > div')
    .draggable({
      onmove: function(event) {
        const target = event.target;

        const dataX = target.getAttribute('data-x');
        const dataY = target.getAttribute('data-y');
        const initialX = parseFloat(dataX) || 0;
        const initialY = parseFloat(dataY) || 0;

        const deltaX = event.dx;
        const deltaY = event.dy;

        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        $('.coq-env > div')
          .css('border', '1.5px dashed #ffffffaa');
        $(target).css({
          'transform': `translateY(${newY}px) scale(1.02)`,
          'box-shadow': '0px 0px 20px 6px #ffffff40',
          'border': '',
          'transition': ''
        });

        target.setAttribute('data-x', newX);
        target.setAttribute('data-y', newY);
      },
      onend: function(event) {
        const target = event.target;
        $('.coq-env > div').css('border', '');
        $(target).css({
          'transition': '.5s all',
          'transform': '',
          'box-shadow': ''
        });
        target.removeAttribute('data-x');
        target.removeAttribute('data-y');
      }
    });
  interact('.coq-env > div')
    .dropzone({
      overlap: 0.2,
      ondrop: async (event) => {
        let first = parseElem(event.relatedTarget);
        let second = parseElem(event.target);
        if (second.type === 'goal')
          await addSentece(`apply ${first.label}`);
        else
          await addSentece(`apply ${first.label} in ${second.label}`);
      }
    });
};

const _ = { rule: 'everything' };

const match = (tree, pattern) => {
  if (typeof pattern === 'string') {
    return tree.text === pattern;
  }
  if (pattern instanceof Array) {
    if (!tree.children) return false;
    for (let i = 0; i < pattern.length; i += 1) {
      if (!match(tree.children[i], pattern[i])) return false;
    }
    return true;
  }
  if (pattern.rule === 'everything') {
    return true;
  }
  return false;
};

const setupOnClick = () => {
  for (const elem of document.querySelectorAll('.coq-env > div')) {
    const p = parseElem(elem);
    elem.addEventListener('dblclick', async () => {
      console.log('dblclick', p);
      if (p.type === 'goal') {
        if (match(p.tree, [['forall']])) {
          return addSentece(`intros`);
        }
        if (match(p.tree, [_, '/\\'])) {
          return addSentece(`constructor`);
        }
        return swal({
          text: g`no_action_for_goal`,
          icon: 'error',
        });
      }
    });
    elem.addEventListener('contextmenu', async (ev) => {
      let items = undefined;
      if (p.type === 'goal') {
        if (match(p.tree, [_, '\\/'])) {
          items = [
            {
              label: g`tactic_left`,
              action: () => addSentece('left'),
            },
            {
              label: g`tactic_right`,
              action: () => addSentece('right'),
            },
          ];
        }
        if (!items) {
          // goal not detected, show a default list
          items = [
            {
              label: g`tactic_intros`,
              action: () => addSentece('intros'),
            },
            {
              label: g`tactic_constructor`,
              action: () => addSentece('constructor'),
            },
            {
              label: g`tactic_auto`,
              action: () => addSentece('auto'),
            },
          ];
        }
      } else {
        items = [
          {
            label: g`hyp`,
            action: () => {},
          },
        ];
      }
      createMenu(items, elem, ev);
      ev.preventDefault();
    });
  }
};

export const setup = () => {
  setupDragDrop();
  setupOnClick();
};
