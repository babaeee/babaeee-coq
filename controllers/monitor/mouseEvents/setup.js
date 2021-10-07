import interact from 'interactjs';
import { addSentece } from "../../../util/coq/index.js";
import $ from "jquery";
import cssLemma from "../../lemma/lemma.css";

const parseElem = (elem) => {
  let l = elem.querySelector('label');
  if (l != null) {
    return {
      type: 'hyp',
      label: l.innerText,
    };
  }
  return { type: 'goal' };
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

const setupOnClick = () => {
  for (const elem of document.querySelectorAll('.coq-env > div')) {
    const p = parseElem(elem);
    elem.addEventListener('dblclick', async () => {
      if (p.type === 'goal') {
        await addSentece(`intros`);
      }
    });
  }
};

export const setup = () => {
  setupDragDrop();
  setupOnClick();
};
