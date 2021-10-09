Axiom even: nat -> Prop.
Axiom odd: nat -> Prop.
Axiom odd_to_even: forall x: nat, odd x -> even (S x).
Axiom even_0: even 0.
Axiom odd_1: odd 1.

Axiom divide: nat -> nat -> Prop.

Notation "a | b" := (divide a b)(at level 60).

Axiom divide_plus: forall a b x: nat, x | a + b -> x | a -> x | b.
Axiom divide_1: forall x: nat, x | 1 -> x < 2.
