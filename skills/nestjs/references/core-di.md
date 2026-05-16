---
name: core-di
description: Dependency injection - provider types, injection patterns, scopes, ModuleRef, forwardRef
---

# Dependency Injection

## Provider Types

```typescript
// Class provider (default)
{ provide: CatsService, useClass: CatsService }

// Value provider
{ provide: 'CONNECTION', useValue: connection }

// Factory provider
{
  provide: 'ASYNC_CONNECTION',
  useFactory: (config: ConfigService) => config.createConnection(),
  inject: [ConfigService],
}

// Alias provider
{ provide: 'AliasedService', useExisting: CatsService }
```

## Injection Patterns

```typescript
// Constructor injection (standard)
@Injectable()
export class CatsService {
  constructor(private readonly dogsService: DogsService) {}
}

// Token-based injection
constructor(@Inject('CONNECTION') private connection: Connection) {}

// Optional dependency
constructor(@Optional() private config?: ConfigService) {}

// Property injection (less common)
@Inject('OPTIONS')
private options: SomeOptions;
```

## Provider Scopes

```typescript
@Injectable({ scope: Scope.DEFAULT })    // Singleton (default) - one instance per module
@Injectable({ scope: Scope.REQUEST })    // New instance per HTTP request
@Injectable({ scope: Scope.TRANSIENT })  // New instance per injection
@Injectable({ scope: Scope.DEFAULT, durable: true }) // Request-scoped with persistent metadata
```

**Scope hierarchy**: A REQUEST-scoped controller makes all its injected providers REQUEST-scoped too. Use `scope: Scope.DEFAULT` on individual providers to opt out.

## ModuleRef

Dynamic resolution of providers at runtime:

```typescript
constructor(private moduleRef: ModuleRef) {}

// Get singleton instance
const service = this.moduleRef.get(CatsService, { strict: false });

// Resolve transient/request-scoped instance
const service = await this.moduleRef.resolve(CatsService, contextId);
```

## Circular Dependencies

Use `forwardRef` to break circular dependency cycles:

```typescript
// In module imports
@Module({ imports: [forwardRef(() => DogsModule)] })

// In service injection
constructor(@Inject(forwardRef(() => DogsService)) private dogs: DogsService) {}
```

## Registering Providers with Tokens

```typescript
// Using string tokens
providers: [{ provide: 'CONFIG', useValue: { port: 3000 } }]

// Using Symbol tokens
const CONFIG = Symbol('CONFIG');
providers: [{ provide: CONFIG, useValue: { port: 3000 } }]

// Using class tokens
providers: [CatsService] // shorthand for { provide: CatsService, useClass: CatsService }
```

<!--
Source references:
- https://docs.nestjs.com/fundamentals/custom-providers
- https://docs.nestjs.com/fundamentals/injection-scopes
- https://docs.nestjs.com/fundamentals/circular-dependency
- https://docs.nestjs.com/fundamentals/module-ref
-->
