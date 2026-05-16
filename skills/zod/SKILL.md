---
name: zod
description: Zod TypeScript-first schema validation library. Use when defining schemas, parsing and validating data, handling validation errors, transforming data, or implementing form/API validation in TypeScript projects.
metadata:
  author: Colin McDonnell
  version: "2026.5.16"
  source: Generated from https://github.com/colinhacks/zod, scripts located at https://github.com/antfu/skills
---

# Zod

Zod is a TypeScript-first schema validation library with static type inference. Define schemas that map one-to-one to TypeScript types, then parse, validate, and transform data with full type safety.

> The skill is based on Zod v4.4.3, generated at 2026-05-16.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Basics | Schema definition, parsing, type inference, coercion | [core-basics](references/core-basics.md) |
| Primitives | Primitives, string formats, numbers, dates, enums, stringbool | [core-primitives](references/core-primitives.md) |
| Objects | Objects, arrays, tuples, records, maps, sets, files | [core-objects](references/core-objects.md) |
| Unions | Unions, discriminated unions, intersections, literals | [core-unions](references/core-unions.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Transforms | Transforms, pipes, codecs (bidirectional transforms) | [features-transforms](references/features-transforms.md) |
| Refinements | Custom validation with refine, superRefine, check | [features-refinements](references/features-refinements.md) |
| Wrappers | Optional, nullable, nullish, defaults, catch, branded, readonly | [features-wrappers](references/features-wrappers.md) |
| Functions | Zod-validated function schemas | [features-functions](references/features-functions.md) |

## Error Handling

| Topic | Description | Reference |
|-------|-------------|-----------|
| Errors | Error formatting, customization, i18n, precedence | [error-handling](references/error-handling.md) |

## Integration

| Topic | Description | Reference |
|-------|-------------|-----------|
| JSON Schema | Convert Zod schemas to/from JSON Schema, OpenAPI support | [features-json-schema](references/features-json-schema.md) |
| Metadata | Registries, metadata, describe, global registry | [features-metadata](references/features-metadata.md) |
| Library Authors | Peer dependencies, Zod 3/4 dual support, Standard Schema | [features-library-authors](references/features-library-authors.md) |

## Key Recommendations

- **Use `z.infer<>`** to extract TypeScript types from schemas
- **Use `.safeParse()`** over `.parse()` to avoid try/catch — returns a discriminated union
- **Use `.pipe()` or `.transform()`** for data transformations, not `.refine()`
- **Use `z.coerce`** for automatic type coercion of primitives
- **Use `z.discriminatedUnion()`** over `z.union()` when a discriminator key exists — faster parsing
- **Use `.default()`** for optional fields with fallback values
- **Prefer `.extend()` or spread syntax** over `z.intersection()` for merging object schemas
- **Use async variants** (`.parseAsync()`, `.safeParseAsync()`) when using async refinements/transforms
