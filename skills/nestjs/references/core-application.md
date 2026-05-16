---
name: core-application
description: Application bootstrap, NestFactory, lifecycle hooks, shutdown hooks, configuration
---

# Application Bootstrap & Lifecycle

## NestFactory

```typescript
const app = await NestFactory.create(AppModule);

// With options
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log'],  // or custom LoggerService
  bufferLogs: true,     // buffer logs until custom logger is set
  abortOnError: false,  // don't abort on init error
  snapshot: true,       // enable dependency graph snapshots
});

// HTTPS
const app = await NestFactory.create(AppModule, {
  httpsOptions: { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
});
```

## Application Types

```typescript
// HTTP application
const app = await NestFactory.create(AppModule);

// Microservice
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.TCP,
  options: { host: 'localhost', port: 3001 },
});

// Standalone context (no HTTP, no microservice)
const app = await NestFactory.createApplicationContext(AppModule);
const service = app.get(CatsService);
```

Hybrid app (HTTP + microservice):
```typescript
const app = await NestFactory.create(AppModule);
app.connectMicroservice({ transport: Transport.TCP });
await app.startAllMicroservices();
await app.listen(3000);
```

## Common Application Setup

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: ['health'],              // exclude routes from prefix
    forbidUnknownVersion: true,       // reject unversioned routes
  });

  // Global pipes, guards, interceptors, filters
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors({ origin: ['https://example.com'] });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: VERSION_NEUTRAL });

  // Shutdown hooks
  app.enableShutdownHooks();

  await app.listen(3000);
}
```

## Fastify Adapter

```typescript
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

// Fastify-specific: built-in inject() for testing
// Schema validation, higher performance
```

Express-specific:
```typescript
import { NestExpressApplication } from '@nestjs/platform-express';
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.useStaticAssets(join(__dirname, 'public'));
app.setBaseViewsDir(join(__dirname, 'views'));
app.setViewEngine('hbs');
```

## Lifecycle Hooks

Implement in any provider:

```typescript
@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, OnApplicationShutdown {
  onModuleInit() { /* called when this provider's module initializes */ }
  onApplicationBootstrap() { /* called after all modules initialized */ }
  onModuleDestroy() { /* cleanup during shutdown */ }
  beforeAppShutdown(signal?: string) { /* before app closes */ }
  onApplicationShutdown(signal?: string) { /* final cleanup */ }
}
```

Execution order: `onModuleInit` → `onApplicationBootstrap` → (app runs) → `onModuleDestroy` → `beforeAppShutdown` → `onApplicationShutdown`.

## Application Context Methods

```typescript
app.get(Token)                    // get singleton provider
app.resolve(Token)                // resolve request-scoped provider
app.select(FeatureModule)         // get a module's context
app.close()                       // close the application
app.init()                        // initialize without listening
app.useLogger(new CustomLogger()) // set custom logger
app.flushLogs()                   // flush buffered logs
```

<!--
Source references:
- https://docs.nestjs.com/fundamentals/bootstrap
- https://docs.nestjs.com/fundamentals/lifecycle-events
- https://docs.nestjs.com/fundamentals/application-context
- https://docs.nestjs.com/techniques/performance
-->
