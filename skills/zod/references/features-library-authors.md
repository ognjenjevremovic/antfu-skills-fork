# Library Authors

Guidance for building libraries on top of Zod.

## Standard Schema

If your library accepts schemas for black-box validation, use [Standard Schema](https://standardschema.dev/) instead of depending on Zod directly. Most popular validation libraries implement this spec.

## Peer Dependencies

```json
{
  "peerDependencies": {
    "zod": "^3.25.0 || ^4.0.0"
  },
  "devDependencies": {
    "zod": "^3.25.0 || ^4.0.0"
  }
}
```

## Zod 4 Subpaths

Use these stable subpaths only:

- `"zod/v3"` — Zod 3
- `"zod/v4/core"` — Zod 4 Core (shared between Classic and Mini)

Avoid:
- `"zod"` — ambiguous between versions
- `"zod/v4"` and `"zod/v4/mini"` — specific implementations, not cross-compatible

## Supporting Zod 3 and 4

```ts
import * as z3 from "zod/v3";
import * as z4 from "zod/v4/core";

type Schema = z3.ZodTypeAny | z4.$ZodType;
```

No major version bump needed — just update the peer dependency minimum.
