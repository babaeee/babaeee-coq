export const coqInit = async () => {
  await window.JsCoq.load();
};

export const coqManager = async ({ onNewGoal = () => {} }) => {
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
      onNewGoal(goals);
    }
    coqFeedback(...args) {
      console.log(...args);
    }
    coqCoqExn(...args) {
      alert(args[2]);
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

export const addSentece = async (obj, sentence) => {
  obj.sid += 1;
  const coq = obj.coq;
  coq.add(obj.sid - 1, obj.sid, sentence);
  await coq.execPromise(obj.sid);
  coq.goals(obj.sid);
};
