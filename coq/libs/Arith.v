Definition even (x:nat) := exists k:nat, x = 2 * k.
Definition odd(x:nat) := exists k:nat, x = 2 * k.
Definition divide (x y:nat) := exists k:nat, x * k = y.