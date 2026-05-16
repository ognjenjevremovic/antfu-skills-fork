# Metadata and Registries

Attach metadata to schemas for documentation, JSON Schema generation, and tooling.

## Registries

Create typed registries:

```ts
const myRegistry = z.registry<{ description: string }>();

myRegistry.add(mySchema, { description: "A cool schema!" });
myRegistry.has(mySchema);  // => true
myRegistry.get(mySchema);  // => { description: "A cool schema!" }
myRegistry.remove(mySchema);
```

Register inline with `.register()`:

```ts
const mySchema = z.object({
  name: z.string().register(myRegistry, { description: "User name" }),
  age: z.number().register(myRegistry, { description: "User age" }),
});
```

Constrain schema types:

```ts
const stringRegistry = z.registry<{ desc: string }, z.ZodString>();
```

## Global Registry

`z.globalRegistry` stores metadata for JSON Schema generation:

```ts
z.email().register(z.globalRegistry, {
  id: "email_address",
  title: "Email address",
  description: "Your email address",
  examples: ["first.last@example.com"],
});
```

Augment the `GlobalMeta` interface via declaration merging:

```ts
// zod.d.ts
declare module "zod" {
  interface GlobalMeta {
    examples?: unknown[];
  }
}
export {};
```

## `.meta()`

Convenient global registry access:

```ts
z.email().meta({ id: "email", title: "Email", description: "Valid email" });
schema.meta(); // retrieve metadata
```

Metadata is per-instance — chaining creates new instances without inherited metadata.

## `.describe()`

Shorthand for `.meta({ description })`:

```ts
z.email().describe("An email address");
// equivalent to .meta({ description: "An email address" })
```
