import { createNode } from "../dom.js";

let globalObj = {};

let subscribers = {
  goal: [], history: [], exn: [], lemma: [],
};

let pprint;
let readyPromise;
let history = [];
let lemmas = [];

export const goalsToDOM = (goals) => {
  if (!goals) return [createNode('div', {}, 'error')];
  return pprint.goals2DOM(goals);
};

export const ppToDOM = (pp) => {
  return pprint.pp2DOM(pp);
}

export const subscribe = (e, f) => {
  subscribers[e].push(f);
};

const emit = (e, v) => {
  for (const f of subscribers[e]) {
    f(v);
  }
};

const pushHistory = (sentence) => {
  history.push(sentence);
  emit('history', history);
};

export const coqManager = async () => {
  const Observer = class {
    constructor() {
      this.when_ready = new Promise((resolve) => (this._ready = resolve));
    }
    coqReady() {
      this._ready();
    }
    coqGoalInfo(sid, goals) {
      var bar = `\n${"-".repeat(60)}\n`;
      console.log(bar, goals, bar);
      emit('goal', goals);
    }
    coqFeedback(...args) {
      console.log(...args);
    }
    coqCoqExn(loc, sids, msg) {
      emit('exn', msg);
      if (!sids) return;
      const [sid] = sids;
      globalObj.sid = sid;
      globalObj.coq.cancel(sid+1);
      history.pop();
      emit('history', history);
    }
    coqPending(nsid, prefix, module_names) {
      //let stm = this.doc.stm_id[nsid];
      //let ontop = this.lastAdded(nsid);

      //let ontop_finished = this.coq.execPromise(ontop.coq_sid); // assumes that exec is harmless if ontop was executed already...

      var pkg_deps = new Set();
      for (let module_name of module_names) {
        let deps = this.pm.index.findPackageDeps(prefix, module_name);
        for (let dep of deps) pkg_deps.add(dep);
      }

      for (let d of this.pm.loaded_pkgs) pkg_deps.delete(d);

      pkg_deps = [...pkg_deps.values()];

      var cleanup = () => {};

      if (pkg_deps.length > 0) {
        console.log("MyPending: loading packages", pkg_deps);
        this.disable();
        this.pm.expand();
        cleanup = () => {
          this.pm.collapse();
          this.enable();
        };
      }

      this.pm
        .loadDeps(pkg_deps)
        //.then(() => ontop_finished)
        .then(() => {
          this.coq.reassureLoadPath(this.pm.getLoadPath());
          alert('finish');
          cleanup();
        });
    }
    coqLog() {}
  };
  var coq,
    o = new Observer();

  coq = new CoqWorker();
  o.coq = coq;
  o.pm = new PackageManager(
    document.createElement("div") /* need a div, sry */,
    { "node_modules/jscoq/coq-pkgs/": ["coq"] },
    {},
    coq
  );

  coq.options.debug = true;
  coq.options.warn = true; // false will silence warnings about unhandled messages
  coq.observers.push(o);

  // Load packages
  await coq.when_created;
  await o.pm.populate();
  await o.pm.loadDeps(["coq"]);

  // Initialize document
  coq.init(
    {},
    { lib_init: [["Coq", "Init", "Prelude"]], lib_path: o.pm.getLoadPath() }
  );
  await o.when_ready;

  return { coq, sid: 1 };
};

export const coqInit = () => {
  if (readyPromise) return readyPromise;
  const f = async () => {
    await window.JsCoq.load();
    pprint = new FormatPrettyPrint();
    globalObj = await coqManager();
  };
  readyPromise = f();
  return readyPromise;
};

export const addSentece = async (sentence, options = {}) => {
  if (!options.isLib) {
    pushHistory(sentence);
  }
  globalObj.sid += 1;
  const coq = globalObj.coq;
  coq.add(globalObj.sid - 1, globalObj.sid, sentence + '.');
  await coq.execPromise(globalObj.sid);
  coq.goals(globalObj.sid);
};

export const addLemmas = (list) => {
  lemmas.push(...list);
  emit('lemma', lemmas);
};

export const reset = () => {
  history = [];
  lemmas = [];
  globalObj.coq.cancel(1);
  globalObj.sid = 1;
  emit('history', history);
  emit('lemma', lemmas);
};
