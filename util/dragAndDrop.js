import interact from 'interactjs';
import { addSentece } from "./coq/index.js";
import $ from "jquery";

export const coqHypothesis = () => {
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
      ondrop: function (event) {
        let first = event.relatedTarget.querySelector('label');
        if (first != null)
          first = first.innerHTML;
        let second = event.target.querySelector('label');
        if (second != null)
          second = second.innerHTML;
        if (second == null)
          addSentece(`apply ${first}.`);
        else
          addSentece(`apply ${first} in ${second}.`);
      }
    });
};
