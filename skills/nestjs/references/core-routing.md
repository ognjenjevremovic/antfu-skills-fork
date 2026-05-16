---
name: core-routing
description: Controllers, route decorators, parameter decorators, versioning, SSE, file upload
---

# Routing & Controllers

## Controller Setup

```typescript
@Controller('cats')           // path prefix
@Controller({ path: 'cats', version: '1' })  // with versioning
@Controller({ host: ':domain.example.com' })  // host filtering
export class CatsController {}
```

## Route Handlers

```typescript
@Get()           getAll() {}
@Get(':id')      getOne(@Param('id') id: string) {}
@Post()          create(@Body() dto: CreateCatDto) {}
@Put(':id')      update(@Param('id') id: string, @Body() dto: UpdateCatDto) {}
@Patch(':id')    partialUpdate(@Param('id') id: string, @Body() dto: PartialDto) {}
@Delete(':id')   remove(@Param('id') id: string) {}
@All()           handleAll() {}       // matches all methods
@Get('*.txt')    getFiles() {}        // wildcards
```

WebDAV methods: `@Search`, `@Propfind`, `@Proppatch`, `@Mkcol`, `@Copy`, `@Move`, `@Lock`, `@Unlock`.

## Parameter Decorators

```typescript
@Req()          req: Request           // full request object
@Res()          res: Response          // full response (opts out of Nest response handling)
@Res({ passthrough: true })            // keeps Nest response handling alongside @Res
@Next()         next: Function
@Body()         body: any              // request body
@Body('name')   name: string           // specific body property
@Param('id')    id: string             // route parameter
@Query('page')  page: string           // query string
@Headers('content-type') ct: string    // request header
@Ip()           ip: string             // client IP
@Session()      session: any           // session object
@HostParam('domain') domain: string    // host parameter
@RawBody()      raw: Buffer            // raw request body
```

Parameter decorators accept pipes as additional arguments:
```typescript
@Param('id', ParseIntPipe) id: number
@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
@Body(new ValidationPipe()) dto: CreateDto
```

## Custom Parameter Decorator

```typescript
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});

// Usage
@Get('profile')
getProfile(@User() user: UserEntity) {}
@Get('email')
getEmail(@User('email') email: string) {}
```

## Response Control

```typescript
@HttpCode(204)                    // custom status code (default POST = 201)
@Header('Cache-Control', 'none')  // custom response header
@Redirect('https://example.com')  // redirect
@Render('index')                  // MVC template rendering
```

Dynamic redirect:
```typescript
@Redirect()
redirect(@Query('version') version: string) {
  return { url: version === '2' ? '/v2/cats' : '/cats' };
}
```

## API Versioning

Enable in bootstrap:
```typescript
app.enableVersioning({
  type: VersioningType.URI,    // /v1/cats
  // type: VersioningType.HEADER,  // Accept-Version header
  // type: VersioningType.MEDIA_TYPE, // Accept: application/vnd.nestjs.v1+json
  defaultVersion: '1',
});
```

Controller/method level:
```typescript
@Controller({ path: 'cats', version: '1' })  // all routes versioned

@Get({ path: '/', version: '2' })  // specific route version
```

## Server-Sent Events

```typescript
@Sse('notifications')
notifications(): Observable<MessageEvent> {
  return interval(1000).pipe(
    map(() => ({ data: 'update' } as MessageEvent)),
  );
}
```

## File Upload (Express)

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {}

@Post('uploads')
@UseInterceptors(FilesInterceptor('files', 10))  // max 10 files
uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {}

// Multiple fields
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'photos', maxCount: 10 },
]))

// Any files
@UseInterceptors(AnyFilesInterceptor())
```

File validation:
```typescript
@UploadedFile(
  new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: 'image/png' })
    .addMaxSizeValidator({ maxSize: 1000 })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
)
```

<!--
Source references:
- https://docs.nestjs.com/controllers
- https://docs.nestjs.com/routing
- https://docs.nestjs.com/versioning
- https://docs.nestjs.com/techniques/streaming
- https://docs.nestjs.com/techniques/file-upload
-->
