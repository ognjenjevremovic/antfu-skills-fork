---
name: core-modules
description: NestJS module system - @Module, @Global, DynamicModule, ConfigurableModuleBuilder
---

# Modules

NestJS uses modules to organize application structure. Every app has at least one root module.

## Module Definition

```typescript
@Module({
  imports: [OtherModule],       // other modules this module depends on
  controllers: [CatsController], // controllers registered in this module
  providers: [CatsService],      // providers (services) registered here
  exports: [CatsService],        // providers available to importing modules
})
export class CatsModule {}
```

## Global Modules

`@Global()` makes a module's exports available across all modules without explicit imports.

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

## Dynamic Modules

Static factory methods on the module class enable runtime configuration:

```typescript
@Module({})
export class DatabaseModule {
  static register(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DB_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}

// Usage:
@Module({ imports: [DatabaseModule.register({ host: 'localhost' })] })
export class AppModule {}
```

Naming convention: `register` (one-time), `forRoot` (global config), `forFeature` (feature-specific).

## ConfigurableModuleBuilder

Type-safe builder for dynamic modules:

```typescript
const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<ConfigOptions>().build();

@Module({ providers: [ConfigService], exports: [ConfigService] })
export class ConfigModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return super.register(options);
  }
}
```

## Module Structure Conventions

```
cats/
  cats.module.ts
  cats.controller.ts
  cats.service.ts
  dto/
    create-cat.dto.ts
  interfaces/
    cat.interface.ts
```

<!--
Source references:
- https://docs.nestjs.com/modules
- https://docs.nestjs.com/fundamentals/dynamic-modules
- https://docs.nestjs.com/fundamentals/module-ref
-->
