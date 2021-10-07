Axiom even: nat -> Prop.
Axiom odd: nat -> Prop.
Axiom odd_to_even: forall x: nat, odd x -> even (S x).
Axiom even_0: even 0.
Axiom odd_1: odd 1.
