# Transforms

Transforms, pipes, and codecs for data transformation.

## Transforms

Unidirectional transformations that accept any input:

```ts
const castToString = z.transform((val) => String(val));
castToString.parse(123); // => "123"
```

With validation and error reporting:

```ts
const coercedInt = z.transform((val, ctx) => {
  try {
    return Number.parseInt(String(val));
  } catch {
    ctx.issues.push({ code: "custom", message: "Not a number", input: val });
    return z.NEVER; // exit without affecting return type
  }
});
```

Transform functions should never throw.

### `.transform()` Method

Convenience method on any schema:

```ts
const stringToLength = z.string().transform(val => val.length);
stringToLength.parse("hello"); // => 5
```

Async transforms:

```ts
const idToUser = z.string().transform(async (id) => {
  return db.getUserById(id);
});
const user = await idToUser.parseAsync("abc123");
```

Async transforms require `.parseAsync()` or `.safeParseAsync()`.

## Pipes

Chain schemas together:

```ts
const stringToLength = z.string().pipe(z.transform(val => val.length));
stringToLength.parse("hello"); // => 5
```

Common with transforms: validate first, then transform.

## Codecs

Bidirectional transforms (introduced in Zod 4.1):

```ts
const stringToDate = z.codec(
  z.iso.datetime(), // input schema
  z.date(),         // output schema
  {
    decode: (isoString) => new Date(isoString),
    encode: (date) => date.toISOString(),
  }
);

stringToDate.parse("2024-01-15T10:30:00.000Z"); // => Date
z.decode(stringToDate, "2024-01-15T10:30:00.000Z"); // => Date (typed input)
z.encode(stringToDate, new Date("2024-01-15")); // => string
z.invertCodec(stringToDate); // swap input/output
```

### Preprocess

Pipe a transform into a schema:

```ts
const coercedInt = z.preprocess((val) => {
  if (typeof val === "string") return Number.parseInt(val);
  return val;
}, z.int());
```

Narrow input type by annotating the preprocessor:

```ts
const trimmed = z.preprocess(
  (val: string | null | undefined) => val?.trim() ?? "",
  z.string()
);
```
