# Basics

Schema definition, parsing, type inference, and coercion.

## Defining a Schema

```ts
import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number()
});
```

## Parsing Data

Use `.parse()` to validate input. Returns a deep clone on success, throws `ZodError` on failure.

```ts
Player.parse({ username: "billie", xp: 100 }); // => { username: "billie", xp: 100 }
```

For async schemas (async refinements/transforms), use `.parseAsync()`:

```ts
await Player.parseAsync({ username: "billie", xp: 100 });
```

## Safe Parsing

`.safeParse()` returns a discriminated union instead of throwing:

```ts
const result = Player.safeParse({ username: 42, xp: "100" });
if (!result.success) {
  result.error; // ZodError instance
} else {
  result.data; // { username: string; xp: number }
}
```

Async variant: `.safeParseAsync()`.

## Type Inference

```ts
type Player = z.infer<typeof Player>; // { username: string; xp: number }
```

When input and output types diverge (e.g., transforms):

```ts
const mySchema = z.string().transform((val) => val.length);

type MySchemaIn = z.input<typeof mySchema>;   // string
type MySchemaOut = z.output<typeof mySchema>;  // number (same as z.infer)
```

## Coercion

`z.coerce` converts input using built-in constructors:

```ts
z.coerce.string();   // String(input)
z.coerce.number();   // Number(input)
z.coerce.boolean();  // Boolean(input)
z.coerce.bigint();   // BigInt(input)
z.coerce.date();     // new Date(input)
```

Input type is `unknown` by default. Specify a more specific input type with generics:

```ts
const B = z.coerce.number<number>();
type BInput = z.input<typeof B>; // => number
```

Boolean coercion uses truthy/falsy values, not `"true"`/`"false"` parsing. For string-to-bool, use `z.stringbool()`.
