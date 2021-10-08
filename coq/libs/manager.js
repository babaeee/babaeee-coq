import { addLemmas, addSentece } from "../../util/coq/index.js";
import Arith from "./Arith.v";
import Items from "./items.yml";

const generateLibraries = (obj) => {
  const libNames = Object.keys(obj);
  for (const name of libNames) {
    const text = obj[name];
    const sentences = text.split('.').map((x) => x.trim()).filter((x) => x != '');
    obj[name] = {
      require: async () => {
        for (const sentence of sentences) {
          await addSentece(sentence, {
            isLib: true,
          });
        }
        addLemmas(Items[name]);
      },
    };
  }
  return obj;
};

export const libs = generateLibraries({ Arith });