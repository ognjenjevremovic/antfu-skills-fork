# Wrappers

Optional, nullable, nullish, defaults, catch, branded, readonly, apply, custom, and lazy schemas.

## Optional

Allow `undefined`:

```ts
z.optional(z.string()); // or z.string().optional()
optionalSchema.unwrap(); // => string schema
```

## Nullable

Allow `null`:

```ts
z.nullable(z.string()); // or z.string().nullable()
nullableSchema.unwrap(); // => string schema
```

## Nullish

Both optional and nullable:

```ts
z.nullish(z.string()); // or z.string().nullish()
```

## Nonoptional

Make schema required (removes optional/nullable):

```ts
z.string().optional().nonoptional();
```

## Defaults

Set default value when input is `undefined`:

```ts
z.string().default("tuna");
z.number().default(Math.random); // function re-executed each time
```

Short-circuits parsing — default must be assignable to the output type.

## Prefaults

Pre-parse default — value is parsed through the schema:

```ts
z.string().transform(val => val.length).prefault("tuna");
// parse(undefined) => 4 (not 0)

z.string().trim().toUpperCase().prefault("  tuna  ");
// parse(undefined) => "TUNA"
```

## Catch

Fallback value on validation error:

```ts
z.number().catch(42);
z.number().catch((ctx) => {
  ctx.error; // the ZodError
  return Math.random();
});
```

## Branded Types

Simulate nominal typing for structural type safety:

```ts
const Cat = z.object({ name: z.string() }).brand<"Cat">();
const Dog = z.object({ name: z.string() }).brand<"Dog">();

type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">

const pluto = Dog.parse({ name: "pluto" });
const simba: Cat = pluto; // ❌ not allowed
```

Brand direction (Zod 4.2+):

```ts
z.string().brand<"Cat", "out">();    // output branded (default)
z.string().brand<"Cat", "in">();     // input branded
z.string().brand<"Cat", "inout">();  // both branded
```

## Readonly

```ts
z.object({ name: z.string() }).readonly();
// inferred: Readonly<{ name: string }>

z.array(z.string()).readonly();
z.tuple([z.string(), z.number()]).readonly();
z.map(z.string(), z.date()).readonly();
z.set(z.string()).readonly();
```

Result is frozen with `Object.freeze()`.

## Apply

Incorporate external functions into method chain:

```ts
function setCommonChecks<T extends z.ZodNumber>(schema: T) {
  return schema.min(0).max(100);
}

z.number().apply(setCommonChecks).nullable();
```

## Custom

Schema for types without built-in support:

```ts
const decimalSchema = z.custom<Decimal>((val) => Decimal.isDecimal(val));
z.custom<{ arg: string }>(); // no validation — dangerous
```

For class instances, prefer `z.instanceof()`.

## Lazy

Recursive or deferred schemas:

```ts
z.lazy(() => z.union([
  z.string(),
  z.number(),
  z.array(jsonSchema),
  z.record(z.string(), jsonSchema),
]));
```

## JSON

Validate any JSON-encodable value:

```ts
z.json(); // string | number | boolean | null | array | record
```
