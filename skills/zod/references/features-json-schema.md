# JSON Schema

Convert Zod schemas to and from JSON Schema.

## `z.toJSONSchema()`

Convert a Zod schema to JSON Schema:

```ts
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

z.toJSONSchema(schema);
// {
//   type: 'object',
//   properties: { name: { type: 'string' }, age: { type: 'number' } },
//   required: ['name', 'age'],
//   additionalProperties: false,
// }
```

### Parameters

```ts
z.toJSONSchema(schema, {
  target: "draft-2020-12", // or "draft-07", "draft-04", "openapi-3.0"
  // Additional options available
});
```

### Unrepresentable Types

Some Zod types have no JSON Schema equivalent: `bigint`, `int64`, `symbol`, `undefined`, `void`, `date`, `map`, `set`, `transform`, `nan`, `custom`.

## `z.fromJSONSchema()`

Convert JSON Schema to Zod schema (experimental):

```ts
const jsonSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
  },
  required: ["name", "age"],
};

const zodSchema = z.fromJSONSchema(jsonSchema);
```
