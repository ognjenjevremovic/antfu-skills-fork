# Refinements

Custom validation with `.refine()`, `.superRefine()`, and `.check()`.

## `.refine()`

```ts
const myString = z.string().refine((val) => val.length <= 255);
```

Refinement functions should never throw — return falsy to signal failure.

### Error Message

```ts
z.string().refine((val) => val.length > 8, { error: "Too short!" });
```

### Path

Customize error path (useful in object schemas):

```ts
z.object({ password: z.string(), confirm: z.string() })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords don't match",
    path: ["confirm"],
  });
```

### Abort

Mark refinements as non-continuable to stop validation on first failure:

```ts
z.string()
  .refine((val) => val.length > 8, { error: "Too short!", abort: true })
  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });
```

### Async Refinements

```ts
const userId = z.string().refine(async (id) => {
  return await db.userExists(id);
});
// Must use .parseAsync() or .safeParseAsync()
```

### When

Control when a refinement runs based on prior issues:

```ts
const schema = baseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    when(payload) {
      return baseSchema
        .pick({ password: true, confirmPassword: true })
        .safeParse(payload.value).success;
    },
  }
);
```

## `.superRefine()`

Create multiple issues using Zod's internal issue types:

```ts
z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({
      code: "too_big",
      maximum: 3,
      origin: "array",
      inclusive: true,
      message: "Too many items",
      input: val,
    });
  }
  if (val.length !== new Set(val).size) {
    ctx.addIssue({ code: "custom", message: "No duplicates", input: val });
  }
});
```

## `.check()`

Lower-level API for full control over issue objects:

```ts
z.array(z.string()).check((ctx) => {
  if (ctx.value.length > 3) {
    ctx.issues.push({
      code: "too_big",
      maximum: 3,
      origin: "array",
      inclusive: true,
      message: "Too many items",
      input: ctx.value,
    });
  }
});
```
