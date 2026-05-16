---
name: integrations
description: Common integrations - OpenAPI/Swagger, GraphQL, TypeORM, Prisma, caching, events, queues, scheduling
---

# Integrations

## OpenAPI / Swagger

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Cats API')
  .setDescription('Cat management')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

Decorators:
```typescript
@ApiTags('cats')
@Controller('cats')
export class CatsController {

  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, type: [Cat] })
  @ApiBearerAuth()
  @Get()
  findAll() {}

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {}
}

export class Cat {
  @ApiProperty({ example: 'Garfield', description: 'Cat name' })
  name: string;

  @ApiProperty({ example: 3 })
  age: number;
}
```

## GraphQL (Code-First)

```typescript
// app.module.ts
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema.gql'),
      // or: autoSchemaFile: true (in-memory)
    }),
  ],
})
export class AppModule {}
```

```typescript
@ObjectType()
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CreateRecipeInput {
  @Field()
  title: string;
}

@Resolver(of => Recipe)
export class RecipeResolver {
  @Query(returns => [Recipe])
  recipes() { return this.service.findAll(); }

  @Mutation(returns => Recipe)
  createRecipe(@Args('input') input: CreateRecipeInput) {
    return this.service.create(input);
  }

  @Subscription(returns => Recipe)
  recipeAdded() {
    return this.pubSub.asyncIterableIterator('recipeAdded');
  }
}
```

Schema-first: set `typePaths: ['./**/*.graphql']` instead of `autoSchemaFile`.

## TypeORM

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    TypeOrmModule.forFeature([User, Cat]),
  ],
})
export class AppModule {}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id }); }
  create(dto: CreateUserDto) { return this.repo.save(dto); }
}
```

## Prisma

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}

// Usage in service
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.user.findMany(); }
}
```

## Caching

```typescript
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5000,     // milliseconds
      max: 10,       // max items in cache
    }),
  ],
})
export class AppModule {}

@Controller('cats')
@UseInterceptors(CacheInterceptor)    // auto-caches GET responses
export class CatsController {
  @CacheKey('all-cats')               // custom cache key
  @CacheTTL(20)                       // custom TTL in seconds
  @Get()
  findAll() {}

  @CacheKey('single-cat')
  @CacheTTL(30)
  @Get(':id')
  findOne(@Param('id') id: string) {}
}
```

## Event Emitter

```typescript
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({ imports: [EventEmitterModule.forRoot()] })
export class AppModule {}

// Emit
@Injectable()
export class UserService {
  constructor(private eventEmitter: EventEmitter2) {}
  async create(dto: CreateUserDto) {
    const user = await this.repo.save(dto);
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user));
    return user;
  }
}

// Listen
@Injectable()
export class EmailListener {
  @OnEvent('user.created')
  handleUserCreated(event: UserCreatedEvent) {
    this.emailService.sendWelcome(event.user);
  }
}
```

## Scheduling

```typescript
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({ imports: [ScheduleModule.forRoot()] })
export class AppModule {}

@Injectable()
export class TasksService {
  @Cron('45 * * * * *')             // run at second :45
  handleCron() {}

  @Interval(10000)                    // every 10 seconds
  handleInterval() {}

  @Timeout(5000)                      // once after 5 seconds
  handleTimeout() {}

  // Dynamic scheduling
  constructor(private scheduler: SchedulerRegistry) {
    const callback = () => {};
    const interval = setInterval(callback, 3000);
    this.scheduler.addInterval('my-interval', interval);
  }
}
```

## Queues (Bull)

```typescript
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue({ name: 'emails' }),
  ],
})
export class AppModule {}

@Processor('emails')
export class EmailProcessor {
  @Process('send')
  async handleSend(job: Job<SendEmailDto>) {
    await this.emailService.send(job.data);
  }
}

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emails') private queue: Queue) {}
  async sendLater(dto: SendEmailDto) {
    await this.queue.add('send', dto, { delay: 5000 });
  }
}
```

<!--
Source references:
- https://docs.nestjs.com/openapi/introduction
- https://docs.nestjs.com/graphql/quick-start
- https://docs.nestjs.com/techniques/database
- https://docs.nestjs.com/techniques/caching
- https://docs.nestjs.com/techniques/events
- https://docs.nestjs.com/techniques/task-scheduling
- https://docs.nestjs.com/techniques/queues
-->
