# Error Handling

Error formatting, customization, internationalization, and precedence.

## ZodError

Validation errors are `ZodError` instances with an `.issues` array:

```ts
try {
  Player.parse({ username: 42, xp: "100" });
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues;
    // [{ expected: 'string', code: 'invalid_type', path: ['username'], message: '...' }, ...]
  }
}
```

## Formatting Errors

```ts
// Tree structure mirroring schema shape
const tree = z.treeifyError(result.error);
tree.properties?.username?.errors; // => ["Invalid input: expected string..."]

// Human-readable string
const pretty = z.prettifyError(result.error);
```

## Error Customization

### The `error` Param

Every Zod API accepts a custom error:

```ts
z.string("Not a string!");
z.string().min(5, "Too short!");
z.email({ error: "Bad email!" });
z.array(z.string(), { error: "Not an array!" });
```

### Error Map Function

```ts
z.string({
  error: (iss) => iss.input === undefined ? "Required" : "Invalid",
});

z.string().min(5, {
  error: (iss) => `Must be at least ${iss.minimum} characters`,
});
```

The `iss` object is a discriminated union — use `iss.code` to narrow:

```ts
error: (iss) => {
  if (iss.code === "invalid_type") return `expected ${iss.expected}`;
  if (iss.code === "too_small") return `minimum is ${iss.minimum}`;
  return undefined; // fall back to default
}
```

### Per-Parse Errors

```ts
schema.parse(12, { error: iss => "custom error" });
```

Lower precedence than schema-level errors.

### Global Error Map

```ts
z.config({ customError: (iss) => "globally modified" });
```

Lowest precedence.

## Internationalization

```ts
import * as z from "zod";
import { en } from "zod/locales";

z.config(en()); // or z.config(z.locales.en())
```

Lazy load locales:

```ts
async function loadLocale(locale: string) {
  const { default: localeFn } = await import(`zod/v4/locales/${locale}.js`);
  z.config(localeFn());
}
```

Available locales: ar, az, be, bg, ca, cs, da, de, en, eo, es, fa, fi, fr, frCA, he, hu, hy, id, is, it, ja, ka, km, ko, lt, mk, ms, nl, no, pl, pt, ro, ru, sl, sv, ta, th, tr, uk, ur, uz, vi, zhCN, zhTW, yo.

## Error Precedence

Highest to lowest:

1. **Schema-level** — `z.string("error!")`
2. **Per-parse** — `schema.parse(data, { error: fn })`
3. **Global error map** — `z.config({ customError: fn })`
4. **Locale** — `z.config(z.locales.en())`
5. **Default** — Zod's built-in messages

## Include Input in Issues

```ts
z.string().parse(12, { reportInput: true });
// issues include "input": 12
```
