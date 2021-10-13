Notation "∏ A" := (multi A)(at level 20).
Notation "a | b" := (divide a b)(at level 60).
Notation "\( a , b )" := (Nat.gcd a b)(at level 10).

Axiom nle_gt: forall n m : nat, ~ n <= m <-> m < n.
Axiom divide_plus: forall a b x: nat, x | a + b -> x | a -> x | b.
Axiom divide_1: forall x: nat, x | 1 -> x < 2.
Axiom divide_factor_r: forall n m : nat, n | m * n.
Axiom divide_factor_l: forall n m : nat, n | n * m.
Axiom x_div_Multi : forall (A:Ensemble nat)(x:nat), 
  Finite _ A -> x ∈ A -> x | multi A.
Axiom P_hold_for_mul : forall (A:Ensemble nat)(P:nat -> Prop), Finite _ A
  -> P 1
  -> (forall x:nat, x ∈ A -> P x) -> (forall x y:nat, P x /\ P y -> P (x * y) )
  -> P (∏ A).
Axiom multi_split : forall A X:Ensemble nat, X ⊆ A -> Finite _ X
  -> ∏ A = ∏ X * ∏ A \ X.
Axiom multi_sing : forall x:nat, ∏ \{x} = x.
Axiom ind_gavee : forall P:nat -> Prop, 
  (forall x:nat, (forall y:nat, y < x -> P y) -> P x) ->
  forall x:nat, P x.

Axiom ex_min_Nset : forall A:Ensemble nat, Inhabited _ A
  -> exists x:nat, smallest A x.

Definition prime (x:nat) := 
  1 < x /\ (forall p:nat, 1 <= p < x -> \(x, p) = 1).
Definition Prime : Ensemble nat := fun x => prime x.
