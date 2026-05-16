# Primitives

Primitive types, string formats, numbers, integers, dates, enums, and stringbool.

## Primitive Types

```ts
z.string();
z.number();
z.bigint();
z.boolean();
z.symbol();
z.undefined();
z.null();
z.any();      // inferred: any
z.unknown();  // inferred: unknown
z.never();    // nothing passes
```

## String Validations

```ts
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().regex(/^[a-z]+$/);
z.string().startsWith("aaa");
z.string().endsWith("zzz");
z.string().includes("---");
z.string().uppercase();
z.string().lowercase();
```

String transforms:

```ts
z.string().trim();
z.string().toLowerCase();
z.string().toUpperCase();
z.string().normalize();
```

## String Formats

Built-in format validators:

```ts
z.email();                          // with optional { pattern: regex }
z.uuid();                           // with optional { version: "v4" }
z.uuidv4(); z.uuidv6(); z.uuidv7(); // convenience shortcuts
z.guid();                           // any UUID-like identifier
z.url();                            // WHATWG URL (with optional { hostname, protocol, normalize })
z.httpUrl();                        // http/https URLs only
z.hostname();
z.e164();                           // E.164 phone numbers
z.emoji();
z.base64(); z.base64url();
z.hex();
z.jwt();                            // with optional { alg: "HS256" }
z.nanoid();
z.cuid(); z.cuid2();
z.ulid();
z.ipv4(); z.ipv6();
z.cidrv4(); z.cidrv6();             // CIDR blocks
z.mac();                            // with optional { delimiter: "-" }
z.hash("sha256");                   // or "sha1", "sha384", "sha512", "md5"
```

ISO date/time formats:

```ts
z.iso.date();                       // YYYY-MM-DD
z.iso.time();                       // HH:MM[:SS[.s+]]
z.iso.datetime();                   // with optional { offset, local, precision }
z.iso.duration();
```

Custom string formats:

```ts
const coolId = z.stringFormat("cool-id", (val) => val.length === 100 && val.startsWith("cool-"));
// or with a regex:
z.stringFormat("cool-id", /^cool-[a-z0-9]{95}$/);
```

## Template Literals

```ts
z.templateLiteral(["hello, ", z.string(), "!"]); // `hello, ${string}!`
z.templateLiteral([z.number(), z.enum(["px", "em", "rem"])]); // `${number}px` | ...
```

## Numbers

```ts
z.number();     // any finite number (rejects NaN, Infinity)
z.int();        // safe integer range
z.int32();      // int32 range
z.nan();        // only NaN
```

Number validations:

```ts
z.number().gt(5); z.number().gte(5);    // alias .min(5)
z.number().lt(5); z.number().lte(5);    // alias .max(5)
z.number().positive();                  // alias .gt(0)
z.number().nonnegative();
z.number().negative();
z.number().nonpositive();
z.number().multipleOf(5);               // alias .step(5)
```

## BigInts

```ts
z.bigint();
z.bigint().gt(5n); z.bigint().gte(5n);  // alias .min(5n)
// Same validation methods as numbers but with BigInt values
```

## Booleans

```ts
z.boolean().parse(true);  // => true
z.boolean().parse(false); // => false
```

## Dates

Validates `Date` instances (not strings):

```ts
z.date();
z.date().min(new Date("1900-01-01"));
z.date().max(new Date());
```

## Enums

```ts
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
FishEnum.parse("Salmon"); // ✅
FishEnum.parse("Swordfish"); // ❌

// Access values
FishEnum.enum; // { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }

// Derive new enums
FishEnum.exclude(["Salmon", "Trout"]);  // ["Tuna"]
FishEnum.extract(["Salmon", "Trout"]);  // ["Salmon", "Trout"]
```

Supports TypeScript enums and enum-like objects (`{ [key: string]: string | number }`).

Always pass arrays directly (or use `as const`) for proper type inference:

```ts
const fish = ["Salmon", "Tuna", "Trout"] as const;
const FishEnum = z.enum(fish); // type: "Salmon" | "Tuna" | "Trout"
```

## Literals

```ts
z.literal("tuna");
z.literal(12);
z.literal(true);

// Multiple literal values
z.literal(["red", "green", "blue"]);
```

## Stringbool

Parse "boolish" strings to `boolean` (useful for environment variables):

```ts
const strbool = z.stringbool();
strbool.parse("true");    // => true
strbool.parse("1");       // => true
strbool.parse("yes");     // => true
strbool.parse("false");   // => false
strbool.parse("0");       // => false

// Customize values
z.stringbool({
  truthy: ["true", "1", "yes"],
  falsy: ["false", "0", "no"],
  case: "sensitive", // default: insensitive
});
```
