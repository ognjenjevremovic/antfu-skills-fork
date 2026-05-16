# Unions

Unions, discriminated unions, exclusive unions, and intersections.

## Unions

```ts
const stringOrNumber = z.union([z.string(), z.number()]);
// string | number

stringOrNumber.options; // [ZodString, ZodNumber]
```

## Exclusive Unions (XOR)

Exactly one option must match. Fails if zero or multiple match:

```ts
z.xor([z.string(), z.number()]);

// Mutual exclusivity
const payment = z.xor([
  z.object({ type: z.literal("card"), cardNumber: z.string() }),
  z.object({ type: z.literal("bank"), accountNumber: z.string() }),
]);
```

## Discriminated Unions

Efficient union parsing using a discriminator key:

```ts
const MyResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.string() }),
]);
```

Each option's discriminator prop should be `z.enum()`, `z.literal()`, `z.null()`, or `z.undefined()`.

Nested discriminated unions are supported — Zod optimizes parsing across levels.

## Intersections

```ts
const Person = z.object({ name: z.string() });
const Employee = z.object({ role: z.string() });

const EmployedPerson = z.intersection(Person, Employee);
// Person & Employee
```

Prefer `A.extend(B)` or spread syntax over `z.intersection()` — the result keeps object methods like `.pick()` and `.omit()`.
