---
name: features-validation
description: DTO validation with class-validator, built-in pipes, custom pipes
---

# Validation & Transformation

## DTO with class-validator

```typescript
import { IsString, IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsEnum(Breed)
  @IsOptional()
  breed?: Breed;
}

export class UpdateCatDto extends PartialType(CreateCatDto) {}  // all optional

export class FilterCatDto {
  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
```

Type mapping with `@Type()` from `class-transformer` for implicit conversion when `transform: true` is enabled.

## ValidationPipe Options

```typescript
new ValidationPipe({
  whitelist: true,               // strip undeclared properties
  forbidNonWhitelisted: true,    // throw if undeclared properties present
  transform: true,               // auto-transform to specified types
  transformOptions: {
    enableImplicitConversion: true,  // convert without @Type()
  },
  disableErrorMessages: true,    // hide detailed error messages
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors) => new BadRequestException(errors),
  validateCustomDecorators: false,
  skipMissingProperties: false,
  skipNullProperties: false,
  skipUndefinedProperties: false,
  forbidUnknownValues: true,
})
```

## Built-in Parse Pipes

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

@Get()
find(@Query('sort', new DefaultValuePipe('asc')) sort: string) {}

@Get(':uuid')
findByUuid(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {}

@Post()
create(@Body(new ParseArrayPipe({ items: CreateDto })) dtos: CreateDto[]) {}

@Query('active', ParseBoolPipe) active: boolean
@Query('price', ParseFloatPipe) price: number
@Query('date', ParseDatePipe) date: Date
@Query('status', new ParseEnumPipe(Status)) status: Status
```

All parse pipes accept `{ errorHttpStatusCode, exceptionFactory, optional }`.

## Custom Pipe

```typescript
@Injectable()
export class IntRangePipe implements PipeTransform<string, number> {
  constructor(private min: number, private max: number) {}

  transform(value: string, metadata: ArgumentMetadata): number {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < this.min || num > this.max) {
      throw new BadRequestException(`Value must be between ${this.min} and ${this.max}`);
    }
    return num;
  }
}
```

## Serialization

```typescript
import { Exclude, Expose, Type, classToPlain } from 'class-transformer';

export class UserEntity {
  @Exclude()
  password: string;

  @Expose()
  name: string;

  @Type(() => Address)
  address: Address;
}

// Via interceptor
@UseInterceptors(ClassSerializerInterceptor)
@Get()
findAll(): Promise<UserEntity[]> {}

// With options
@SerializeOptions({ groups: ['public'] })
@Get()
getPublic() {}

// Custom DTO for response
@Serialize(UserResponseDto)
@Get(':id')
findOne(@Param('id') id: string) {}
```

<!--
Source references:
- https://docs.nestjs.com/techniques/validation
- https://docs.nestjs.com/pipes
- https://docs.nestjs.com/techniques/serialization
-->
