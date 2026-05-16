---
name: core-pipeline
description: Request pipeline - middleware, guards, interceptors, pipes, exception filters
---

# Request Pipeline

Every request flows through: **Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after) → Exception Filters**.

## Middleware

Applied via `NestModule` in module `configure()`:

```typescript
@Module({ imports: [LoggerModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes(CatsController);
      // or: .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

Class-based middleware implements `NestMiddleware`:
```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
```

Functional middleware (no class needed):
```typescript
consumer.apply((req, res, next) => { next(); }).forRoutes('*');
```

## Guards

Implement `CanActivate` to control access:

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

Apply to controller or method:
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {}
```

Register globally:
```typescript
// In module providers:
{ provide: APP_GUARD, useClass: AuthGuard }

// Or in bootstrap:
app.useGlobalGuards(new AuthGuard());
```

Custom metadata + Reflector pattern:
```typescript
const Roles = Reflector.createDecorator<string[]>();  // NestJS v11+
// Or: const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Roles(['admin'])
@UseGuards(RolesGuard)
@Delete(':id')
remove(@Param('id') id: string) {}
```

## Interceptors

Implement `NestInterceptor` for cross-cutting concerns:

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

Response transformation:
```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

Exception mapping:
```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
    catchError(err => throwError(() => new HttpException(err.message, HttpStatus.BAD_REQUEST))),
  );
}
```

Caching:
```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.method}:${request.url}`;
    // cache logic...
  }
}
```

## Pipes

Transform or validate data:

```typescript
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // metadata.type: 'body' | 'query' | 'param' | 'custom'
    // metadata.metatype: the expected type
    // metadata.data: string passed to decorator, e.g. @Body('name')
    return transformedValue;
  }
}
```

Built-in pipes: `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseUUIDPipe`, `ParseEnumPipe`, `ParseArrayPipe`, `ParseDatePipe`, `DefaultValuePipe`, `ValidationPipe`.

Global validation setup:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // strip unknown properties
    forbidNonWhitelisted: true, // throw on unknown properties
    transform: true,           // auto-transform types
    transformOptions: { enableImplicitConversion: true },
  }),
);
```

## Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

Catch everything: `@Catch()` (no args). Catch specific: `@Catch(HttpException)`.

Apply:
```typescript
@UseFilters(new HttpExceptionFilter())
@Post()
create(@Body() dto: CreateDto) {}
```

## ExecutionContext

Available in guards, interceptors, and filters:
```typescript
context.getClass()        // controller class
context.getHandler()      // handler method
context.switchToHttp()    // { getRequest, getResponse, getNext }
context.switchToRpc()     // { getContext, getData }
context.switchToWs()      // { getClient, getData, getHandler }
context.getType()         // 'http' | 'rpc' | 'ws'
```

<!--
Source references:
- https://docs.nestjs.com/middleware
- https://docs.nestjs.com/guards
- https://docs.nestjs.com/interceptors
- https://docs.nestjs.com/pipes
- https://docs.nestjs.com/exception-filters
-->
