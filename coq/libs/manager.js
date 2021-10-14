import { addLemmas, addSentece } from "../../util/coq/index.js";
import Arith from "./Arith.v";
import Classic from "./Classic.v";
import Set from "./Set.v";
import Pre_lemma from "./Pre_lemma.v";
import Prelude from "./Prelude.v";
import Items from "./items.yml";

function generateLibraries(obj) {
  const libNames = Object.keys(obj);
  for (const name of libNames) {
    const text = obj[name] + "\n";
    const sentences = text.split(/\.\s*\n\s*/g).map((x) => x.trim()).filter((x) => x != '');
    obj[name] = {
      require: async () => {
        for (const sentence of sentences) {
          await addSentece(sentence, {
            isLib: true,
          });
        }
        addLemmas(Items[name] ?? []);
      },
    };
  }
  return obj;
}

export const libs = generateLibraries({ Arith, Classic, Set, Pre_lemma, Prelude });
