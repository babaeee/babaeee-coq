Section Ensembles.
  Variable U : Type.
  Definition Ensemble := U -> Prop.
  Definition In (A:Ensemble) (x:U) : Prop := A x.
  Definition Included (B C:Ensemble) : Prop := forall x:U, In B x -> In C x.
  Inductive Empty_set : Ensemble :=.
  Inductive Singleton (x:U) : Ensemble :=
    In_singleton : In (Singleton x) x.
  Inductive Union (B C:Ensemble) : Ensemble :=
    | Union_introl : forall x:U, In B x -> In (Union B C) x
    | Union_intror : forall x:U, In C x -> In (Union B C) x.
  Inductive Intersection (B C:Ensemble) : Ensemble :=
    Intersection_intro :
    forall x:U, In B x -> In C x -> In (Intersection B C) x.
  Definition Setminus (B C:Ensemble) : Ensemble :=
    fun x:U => In B x /\ ~ In C x.
  Inductive Inhabited (B:Ensemble) : Prop :=
    Inhabited_intro : forall x:U, In B x -> Inhabited B.
  Definition Strict_Included (B C:Ensemble) : Prop := Included B C /\ B <> C.
End Ensembles.

Notation "x ∈ A" := (In _ A x)(at level 15).
Notation "x ∉ A" := (~ x ∈ A)(at level 15).
Notation "A ⊆ B" := (Included _ A B)(at level 15).
Notation "∅" := (Empty_set _).
Notation "\{ x } " := (Singleton _ x).
Notation "A ∪ B" := (Union _ A B)(at level 10).
Notation "A ∩ B" := (Intersection _ A B)(at level 10).
Notation "A \ B" := (Setminus _ A B)(at level 10).
Notation "A ⊂ B" := (Strict_Included _ A B)(at level 15).

Axiom eq_incl : forall (U:Type)(A B:Ensemble U), A = B <-> A ⊆ B /\ B ⊆ A.
Axiom not_in_union : forall (X:Type)(A B:Ensemble X)(x:X),
  x ∉ A ∪ B <-> x ∉ A /\ x ∉ B.
Axiom not_in_Intersect : forall (X:Type)(A B:Ensemble X)(x:X),
  x ∉ A ∩ B <-> x ∉ A \/ x ∉ B.
Axiom not_in_sub : forall (X:Type)(A B:Ensemble X)(x:X),
  x ∉ A \ B <-> x ∉ A \/ x ∈ B.
Axiom in_sing : forall (X:Type)(x y:X), x ∈ \{y} <-> x = y.
Axiom not_in_emp : forall (U:Type)(x:U), x ∉ Empty_set _.

Ltac unfold_setw x :=
  match goal with 
    | [ H : ?A = ?B |- _] => apply eq_incl in H;destruct H
    | [ H : ?A ⊂ ?B |- _] => destruct H
    | [ H : x ∈ \{?x'} |- _] => apply in_sing in H;destruct H
    | [ H : ?x1 ∉ \{?x1} |- _] => case H;apply in_sing;auto
    | [ H : x ∈ ?A ∩ ?B |- _] => destruct H
    | [ H : x ∈ ?A \ ?B |- _] => destruct H
    | [ H : x ∉ ?A ∪ ?B |- _] => apply (not_in_union _ A B x) in H;destruct H
    | [ H : x ∈ ?A ∪ ?B |- _] => destruct H
    | [ H : x ∉ ?A ∩ ?B |- _] => apply (not_in_Intersect _ A B x) in H;destruct H
    | [ H : x ∉ ?A \ ?B |- _] => apply (not_in_sub _ A B x) in H;destruct H
    | [ H : ?A ⊆ ?B |- _] => specialize(H x);apply imply_to_or in H;destruct H
  end.
Ltac check_in :=
  match goal with
    | [ |- ?x ∈ ?A ∩ ?B] => split;check_in
    | [ |- ?x ∈ ?A ∪ ?B] => elim(classic(x ∈ A));intro;[left;auto|
        right;(repeat unfold_setw x);check_in]
    | [ |- ?x ∈ ?A \ ?B] => split;check_in
    | [ |- ?x ∉ ?A ∩ ?B] => apply (not_in_Intersect _ A B x);
        elim(classic(x ∈ A));intro;
        [right;(repeat unfold_setw x);check_in|left;auto]
    | [ |- ?x ∉ ?A ∪ ?B] => apply (not_in_union _ A B x);split;check_in
    | [ |- ?x ∉ ?A \ ?B] => apply (not_in_sub _ A B x);
        elim(classic(x ∈ A));intro;
        [right;(repeat unfold_setw x);check_in|left;auto]
    | [ |- ?x ∈ \{ ?x }] => apply in_sing;exact (eq_refl x)
    | [ |- ?x ∈ ?A] => tauto
    | [ |- ?x ∉ ?A] => (tauto||(red;intros;(repeat unfold_setw x);tauto))
  end.
Ltac autoEns := 
  match goal with 
    | [|- ?A = ?B] => apply (eq_incl _ A B);split;autoEns
    | [|- ?A ⊆ ?B] => unfold Included;intros;autoEns
    | [ |- ?x ∉ Empty_set ?U] =>  simple apply (not_in_emp U x)
    | [ |- ?x ∈ ?A] => (repeat unfold_setw x);try (tauto||check_in)
    | [ |- ?x ∉ ?A] => (repeat unfold_setw x);try (tauto||check_in)
  end.

Section Ensembles_finis.
  Variable U : Type.

  Axiom Finite: Ensemble U -> Prop.
  Axiom emp_fin : Finite (Empty_set U).
  Axiom fin_add : forall A:Ensemble U, Finite A 
      -> forall x:U, x ∉ A -> Finite (A ∪ \{x}).

End Ensembles_finis.

Definition smallest (A:Ensemble nat)(x:nat) :=
  x ∈ A /\ forall y:nat, y ∈ A -> x <= y.

Axiom set_indz : forall (U:Type)(P:Ensemble U -> Prop),
    P ∅ -> 
    (forall A:Ensemble U, Finite U A -> P A -> 
    forall x:U, x ∉ A -> P (Union U A (\{x}))) ->
    forall e:Ensemble U, Finite U e -> P e.
Ltac ind_set_zaeef A := match goal with
  | [ H : Finite _ A |- _] =>
    eapply set_indz with (e := A);auto
  | _ => idtac "A must finite";fail 1
end.

Axiom multi : Ensemble nat -> nat.
Axiom mul_emp : multi ∅ = 1.
Axiom multi_add : forall (A:Ensemble nat)(x:nat), 
      x ∉ A -> multi (A ∪ \{x}) = multi A * x.
