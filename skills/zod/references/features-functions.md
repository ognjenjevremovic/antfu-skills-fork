# Functions

Zod-validated function schemas.

## Defining Function Schemas

```ts
const MyFunction = z.function({
  input: [z.string()],
  output: z.number(),
});

type MyFunction = z.infer<typeof MyFunction>; // (input: string) => number
```

Omit `output` to only validate inputs.

## Implementing

```ts
const computeTrimmedLength = MyFunction.implement((input) => {
  // TypeScript knows input is a string
  return input.trim().length;
});

computeTrimmedLength("sandwich"); // => 8
computeTrimmedLength(42);         // throws ZodError
```

## Async Implementation

```ts
const computeAsync = MyFunction.implementAsync(async (input) => {
  return input.trim().length;
});
computeAsync("sandwich"); // => Promise<8>
```
