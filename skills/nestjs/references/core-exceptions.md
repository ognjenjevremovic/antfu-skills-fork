---
name: core-exceptions
description: Built-in HTTP exceptions, custom exceptions, exception filters
---

# Exception Handling

## Built-in HTTP Exceptions

All extend `HttpException`:

| Exception | Status |
|-----------|--------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |
| `MethodNotAllowedException` | 405 |
| `NotAcceptableException` | 406 |
| `RequestTimeoutException` | 408 |
| `ConflictException` | 409 |
| `GoneException` | 410 |
| `PreconditionFailedException` | 412 |
| `PayloadTooLargeException` | 413 |
| `UnsupportedMediaTypeException` | 415 |
| `UnprocessableEntityException` | 422 |
| `InternalServerErrorException` | 500 |
| `NotImplementedException` | 501 |
| `BadGatewayException` | 502 |
| `ServiceUnavailableException` | 503 |
| `GatewayTimeoutException` | 504 |

## Usage

```typescript
throw new NotFoundException('Cat not found');
throw new UnauthorizedException('Invalid credentials');

// With cause and description
throw new ForbiddenException('Insufficient permissions', {
  cause: new Error('Role check failed'),
  description: 'User role is not admin',
});

// Custom response body
throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Access denied' }, HttpStatus.FORBIDDEN);
```

## Custom Exceptions

```typescript
export class BusinessException extends HttpException {
  constructor(message: string, code: string) {
    super({ message, code, statusCode: HttpStatus.UNPROCESSABLE_ENTITY }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
```

## Global Exception Filter

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// Register globally
app.useGlobalFilters(new AllExceptionsFilter());
```

## Inheritance Pattern

```typescript
@Catch(HttpException)
export abstract class BaseHttpExceptionFilter<T extends HttpException> implements ExceptionFilter<T> {
  abstract catch(exception: T, host: ArgumentsHost): void;
}
```

<!--
Source references:
- https://docs.nestjs.com/exception-filters
- https://docs.nestjs.com/techniques/validation
-->
