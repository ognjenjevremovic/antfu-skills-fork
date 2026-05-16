# Objects

Objects, arrays, tuples, records, maps, sets, and files.

## Objects

All properties are required by default. Unknown keys are stripped.

```ts
const Dog = z.object({
  name: z.string(),
  age: z.number().optional(),
});
```

### Strictness

```ts
z.strictObject({ name: z.string() }); // errors on unknown keys
z.looseObject({ name: z.string() });  // passes unknown keys through
z.object({ name: z.string() });       // strips unknown keys (default)
```

### Catchall

Validate unknown keys against a schema:

```ts
z.object({ name: z.string() }).catchall(z.string());
```

### Shape Access

```ts
Dog.shape.name; // => string schema
```

### Keyof

```ts
Dog.keyof(); // => ZodEnum<["name", "age"]>
```

### Extend

```ts
Dog.extend({ breed: z.string() });
// Alternative: spread syntax (more tsc-efficient for large schemas)
z.object({ ...Dog.shape, breed: z.string() });
```

`.safeExtend()` prevents overwriting existing properties with non-assignable types and works on schemas with refinements.

### Pick / Omit

```ts
Recipe.pick({ title: true });
Recipe.omit({ id: true });
```

### Partial / Required

```ts
Recipe.partial();                      // all properties optional
Recipe.partial({ ingredients: true }); // specific properties optional
Recipe.required();                     // all properties required
Recipe.required({ description: true });// specific properties required
```

### Recursive Objects

Use getters for self-referential types:

```ts
const Category = z.object({
  name: z.string(),
  get subcategories() { return z.array(Category) },
});
```

For circularity errors, add type annotations to the getter.

## Arrays

```ts
z.array(z.string()); // or z.string().array()
z.array(z.string()).min(5);
z.array(z.string()).max(5);
z.array(z.string()).length(5);

z.array(z.string()).unwrap(); // => string schema
```

## Tuples

Fixed-length arrays with different schemas per index:

```ts
z.tuple([z.string(), z.number(), z.boolean()]);
// => [string, number, boolean]

// Variadic rest argument
z.tuple([z.string()], z.number());
// => [string, ...number[]]
```

## Records

```ts
z.record(z.string(), z.string()); // Record<string, string>

// Enum keys (exhaustive)
const Keys = z.enum(["id", "name", "email"]);
z.record(Keys, z.string()); // { id: string; name: string; email: string }

// Partial record (non-exhaustive)
z.partialRecord(Keys, z.string());

// Loose record (passes non-matching keys)
z.looseRecord(z.string().regex(/_phone$/), z.e164());
```

Numeric keys validate "numeric string" keys:

```ts
z.record(z.number(), z.string()); // validates { 1: "one", 2: "two" }
z.record(z.int().min(0).max(10), z.string()); // with constraints
```

## Maps

```ts
z.map(z.string(), z.number()); // Map<string, number>
```

## Sets

```ts
z.set(z.number()); // Set<number>
z.set(z.string()).min(5);
z.set(z.string()).max(5);
z.set(z.string()).size(5);
```

## Files

```ts
z.file();
z.file().min(10_000);              // min size in bytes
z.file().max(1_000_000);          // max size in bytes
z.file().mime("image/png");       // MIME type
z.file().mime(["image/png", "image/jpeg"]); // multiple MIME types
```

## instanceof

```ts
z.instanceof(Test); // validates `input instanceof Test`

// Property validation
z.instanceof(URL).check(
  z.property("protocol", z.literal("https:"))
);
```
