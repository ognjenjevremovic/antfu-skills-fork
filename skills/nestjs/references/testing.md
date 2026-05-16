---
name: testing
description: Testing module, mocking providers, overriding guards/pipes/interceptors, e2e testing
---

# Testing

## Unit Testing

```typescript
import { Test } from '@nestjs/testing';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CatsService, { provide: Repository, useValue: mockRepo }],
    }).compile();

    service = module.get(CatsService);
  });

  it('should find all cats', async () => {
    expect(await service.findAll()).toEqual([]);
  });
});
```

## Override Methods

```typescript
const module = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(CatsService)
  .useValue(mockCatsService)
  .overrideGuard(AuthGuard)
  .useValue({ canActivate: () => true })
  .overridePipe(ValidationPipe)
  .useValue({ transform: (val) => val })
  .overrideInterceptor(LoggingInterceptor)
  .useValue({ intercept: (_, next) => next.handle() })
  .overrideFilter(AllExceptionsFilter)
  .useValue({ catch: () => {} })
  .overrideModule(DatabaseModule)
  .useModule(MockDatabaseModule)
  .compile();
```

## Global Mocker

Automatically mock unresolvable dependencies:

```typescript
const module = await Test.createTestingModule({
  providers: [CatsService],
})
  .useMocker((token) => {
    if (token === Repository) return { find: jest.fn(), save: jest.fn() };
    return jest.fn(); // default mock
  })
  .compile();
```

## E2E Testing

```typescript
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('CatsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/cats (POST)', () => {
    return request(app.getHttpServer())
      .post('/cats')
      .send({ name: 'Garfield', age: 3 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Fastify E2E Testing

```typescript
const module = await Test.createTestingModule({ imports: [AppModule] })
  .compile();
const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
await app.init();

// Use built-in inject() instead of supertest
const result = await app.inject({ method: 'GET', url: '/cats' });
expect(result.statusCode).toBe(200);
```

## Testing Request-Scoped Providers

```typescript
const contextId = ContextIdFactory.create();
jest.spyOn(ContextIdFactory, 'create').mockReturnValue(contextId);

const module = await Test.createTestingModule({
  providers: [CatsService],
}).compile();

// Resolve request-scoped provider
const service = await module.resolve(CatsService, contextId);
```

## Testing Snapshot Mode

```typescript
const module = await Test.createTestingModule({
  providers: [CatsService],
}).compile({ snapshot: true });
// Enables dependency graph inspection for debugging
```

<!--
Source references:
- https://docs.nestjs.com/fundamentals/testing
- https://docs.nestjs.com/fundamentals/testing#e2e-testing
-->
