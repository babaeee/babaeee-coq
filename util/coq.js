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
  };
  var coq,
    pm,
    o = new Observer();
  
  console.log('pp', window.FormatPrettyPrint);
  
  coq = new CoqWorker();
  pm = new PackageManager(
    document.createElement("div") /* need a div, sry */,
    { "node_modules/jscoq/coq-pkgs/": ["coq"] },
    {},
    coq
  );

  console.log('pp', window.FormatPrettyPrint);
  
  coq.options.debug = true;
  coq.options.warn = false; // will silence warnings about unhandled messages
  coq.observers.push(o);

  // Load packages
  await coq.when_created;
  await pm.populate();
  await pm.loadDeps(["coq"]);

  // Initialize document
  coq.init(
    {},
    { lib_init: [["Coq", "Init", "Prelude"]], lib_path: pm.getLoadPath() }
  );
  await o.when_ready;

  console.log('pp', window.FormatPrettyPrint);

  // Pretty-printer to format messages and goals
  o.pprint = new FormatPrettyPrint();

  console.log('pp22', o.pprint);
  

  // Do some proofs
  coq.add(1, 2, "Goal (forall ghargh_shodan mordan: Prop, ghargh_shodan -> (ghargh_shodan -> mordan) -> mordan).");
  await coq.execPromise(2);
  coq.goals(2);
};
