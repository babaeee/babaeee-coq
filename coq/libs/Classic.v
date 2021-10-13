Axiom classic : forall P : Prop, P \/ ~ P.
Axiom imply_to_or : forall P Q : Prop, (P -> Q) -> ~ P \/ Q.
Axiom NNPP : forall p : Prop, ~ ~ p -> p.
Axiom not_ex_all_not : forall (U : Type) (P : U -> Prop),
       ~ (exists n : U, P n) -> forall n : U, ~ P n.
(*Ltac not_ex_all_not H := idtac const (type_of H);match H with
  | ~ (exists x : ?U , ?P x) => 
    idtac "1";assert(forall x : U, P x);
    apply notex_allnot;auto;clear H
end.*)
Axiom not_and_or : forall P Q : Prop, ~ (P /\ Q) -> ~ P \/ ~ Q.
Axiom not_all_ex_not: forall (U : Type) (P : U -> Prop),
       ~ (forall n : U, P n) -> exists n : U, ~ P n.
Axiom imply_to_and: forall P Q : Prop, ~ (P -> Q) -> P /\ ~ Q.
