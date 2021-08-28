import { RootCtrl } from "./controllers/root/root.js";
import { isRTL } from "./i18n/index.js";
import { addSentece, coqInit, coqManager, ppToDOM, subscribe } from "./util/coq/index.js";

import "./css/coq.notmodule.css";
import "./css/theme.notmodule.css";
import "./css/swal.notmodule.css";
import { delay } from "./util/other.js";
import swal from "sweetalert";
import { createNode } from "./util/dom.js";

if (isRTL()) {
  document.body.dir = 'rtl';
}

const main = async () => {
  coqInit();
  subscribe('exn', async (pp) => {
    const c = createNode('div');
    for (const x of ppToDOM(pp)) {
      c.appendChild(x);
    }
    await swal({
      content: c,
      icon: 'error',
    });
  });
  const root = new RootCtrl();
  document.body.appendChild(root.el);
  await coqInit();
 // await addSentece('Require Import Arith.');
 // await addSentece('Require Import Classical.');
 // await addSentece('Require Import Coq.omega.Omega.');
  
  await addSentece('Definition even (n:nat) := exists k, n = 2 * k.');
  await addSentece('Definition odd (n:nat) := exists k, n = 2 * k + 1.');
  
  await addSentece('Lemma div2_even : forall n:nat, even n <-> n mod 2 = 0.');
/*  await addSentece('Proof. intros. split.');
  await addSentece('intros. destruct H.rewrite H.pose proof (Nat.mod_mul x 2).assert (2 <> 0).  auto. apply H0 in H1. clear H0.assert(x * 2 = 2 * x). exact (Nat.mul_comm x 2). rewrite H0 in H1.exact H1.');
  await addSentece('intros.pose proof (Nat.div_mod n 2). assert(2 <> 0). auto. apply H0 in H1. clear H0.rewrite H in H1.assert(2 * (n / 2) + 0 = 2 * (n / 2)).exact (Nat.add_0_r _).rewrite H0 in H1.exists(n / 2).  exact H1. Qed.');
  
  await addSentece('Lemma div2_odd : forall n:nat, odd n <-> n mod 2 = 1.');
  await addSentece('Proof. intros. split.intros. destruct H.rewrite H. assert(2 * x + 1 = 1 + x * 2). omega. rewrite H0.pose proof (Nat.mod_add 1 x 2). assert(2 <> 0). auto. apply H1 in H2.exact H2.');
  await addSentece('intros.pose proof (Nat.div_mod n 2). assert(2 <> 0). auto. apply H0 in H1. clear H0.rewrite H in H1.exists(n / 2).  exact H1.Qed.');
  
  await addSentece('Lemma even_or_odd : forall n:nat, even n \/ odd n.');
  await addSentece('Proof.intros.pose proof (Nat.mod_upper_bound n 2). assert(2 <> 0). auto. apply H in H0.assert(n mod 2 = 0 \/ n mod 2 = 1).omega.case H1.');
  await addSentece('intros. left. apply div2_even in H2. exact H2.');
  await addSentece('intros. right. apply div2_odd in H2. exact H2.Qed.');

  await addSentece('Lemma not_even : forall n:nat, ~ even n -> odd n. Proof. intros. pose proof (even_or_odd n). tauto. Qed.');
  await addSentece('Lemma not_odd : forall n:nat, ~ odd n -> even n.Proof. intros. pose proof (even_or_odd n). tauto. Qed.');
*/  
 // await addSentece('Goal forall n m:nat, odd (n + m) -> even n /\ odd m \/ odd n /\ even m.');
  //await addSentece('Proof. intros. classical_right.pose proof (not_and_or).pose proof (not_even).pose proof (not_odd).');
};

main();
