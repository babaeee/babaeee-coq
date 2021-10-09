Axiom Ensemble: Type -> Type.
Axiom In: forall A: Type, Ensemble A -> A -> Prop.
Axiom Finite: forall {U : Type}, Ensemble U -> Prop.
Axiom Prime: Ensemble nat.
Axiom Empty_set: forall U: Type, Ensemble U.
Axiom Singleton: forall U: Type, U -> Ensemble U.
Axiom Union: forall U: Type, Ensemble U -> Ensemble U -> Ensemble U.
Axiom Intersection: forall U: Type, Ensemble U -> Ensemble U -> Ensemble U.

Notation "x ∈ A" := (In _ A x)(at level 15).
Notation "x ∉ A" := (~ x ∈ A)(at level 15).
Notation "∅" := (Empty_set _).
Notation "\{ x } " := (Singleton _ x).
Notation "A ∪ B" := (Union _ A B)(at level 10).
Notation "A ∩ B" := (Intersection _ A B)(at level 10).

Axiom Multi : Ensemble nat -> nat.
Axiom multi_empty : Multi ∅ = 1.
Axiom multi_add : forall (A:Ensemble nat)(x:nat), 
  x ∉ A -> Multi (A ∪ \{x}) = Multi A * x.

Notation "∏ A" := (Multi A)(at level 20).

Axiom prime_0: 0 ∉ Prime.
Axiom prime_1: 1 ∉ Prime.
Axiom prime_2: 2 ∈ Prime.
Axiom prime_3: 3 ∈ Prime.

Axiom prime_def: forall x: nat, x > 1 -> exists p: nat, p ∈ Prime /\ p | x.
Axiom multi_odd: forall A: Ensemble nat, Finite A -> forall x: nat, x ∈ A -> x | ∏ A.
