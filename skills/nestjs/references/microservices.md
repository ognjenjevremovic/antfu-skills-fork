---
name: microservices
description: Microservice transports, message patterns, client proxies, gRPC
---

# Microservices

## Transport Options

| Transport | Value | Use Case |
|-----------|-------|----------|
| TCP | `Transport.TCP` | Default, simple request/response |
| Redis | `Transport.REDIS` | Pub/sub with pattern matching |
| NATS | `Transport.NATS` | Lightweight messaging |
| MQTT | `Transport.MQTT` | IoT, low bandwidth |
| RabbitMQ | `Transport.RMQ` | AMQP, complex routing |
| Kafka | `Transport.KAFKA` | Event streaming |
| gRPC | `Transport.GRPC` | High-performance RPC |

## Creating a Microservice

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { host: 'localhost', port: 3001 },
});

// Hybrid (HTTP + microservice)
const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});
await app.startAllMicroservices();
await app.listen(3000);
```

## Message Patterns

Request/response (expects acknowledgment):
```typescript
@MessagePattern({ cmd: 'get_user' })
getUser(@Payload() data: { id: string }): User {
  return this.usersService.findOne(data.id);
}
```

Fire-and-forget (no response expected):
```typescript
@EventPattern('user_created')
handleUserCreated(@Payload() data: UserCreatedEvent): void {
  // handle event
}
```

## Client Proxy

Register client in module:
```typescript
imports: [
  ClientsModule.register([
    { name: 'USER_SERVICE', transport: Transport.TCP, options: { port: 3001 } },
  ]),
]
```

Async registration:
```typescript
ClientsModule.registerAsync([
  {
    name: 'USER_SERVICE',
    useFactory: (config: ConfigService) => ({
      transport: Transport.TCP,
      options: { host: config.get('USER_SERVICE_HOST'), port: config.get('USER_SERVICE_PORT') },
    }),
    inject: [ConfigService],
  },
])
```

Inject and use:
```typescript
constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

// Request/response
this.client.send({ cmd: 'get_user' }, { id: '1' }).subscribe(user => {});

// Fire-and-forget
this.client.emit('user_created', { userId: '1' });
```

Property injection with `@Client()`:
```typescript
@Client({ transport: Transport.TCP, options: { port: 3001 } })
private client: ClientProxy;
```

## Transport Configuration Examples

**Redis:**
```typescript
{ transport: Transport.REDIS, options: { host: 'localhost', port: 6379 } }
```

**RabbitMQ:**
```typescript
{
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'cats_queue',
    queueOptions: { durable: true },
    prefetchCount: 10,
  },
}
```

**Kafka:**
```typescript
{
  transport: Transport.KAFKA,
  options: {
    client: { brokers: ['localhost:9092'] },
    consumer: { groupId: 'cats-consumer' },
  },
}
```

## gRPC

Define proto file, then:
```typescript
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    package: 'hero',
    protoPath: join(__dirname, 'hero.proto'),
  },
});

@Controller()
export class HeroController {
  @GrpcMethod('HeroService', 'FindOne')
  findOne(data: { id: number }): Hero {
    return this.heroService.findOne(data);
  }

  // Streaming
  @GrpcStreamMethod('HeroService', 'FindMany')
  findMany(data$: Observable<HeroById>): Observable<Hero> {
    return data$.pipe(map(data => this.heroService.findOne(data)));
  }
}
```

## Custom Transport

```typescript
import { CustomTransportStrategy, Server } from '@nestjs/microservices';

class CustomTransport extends Server implements CustomTransportStrategy {
  listen(callback: () => void) { /* start transport */ }
  close() { /* stop transport */ }
}

// Usage in app:
app.connectMicroservice({ strategy: new CustomTransport() });
```

<!--
Source references:
- https://docs.nestjs.com/microservices/basics
- https://docs.nestjs.com/microservices/redis
- https://docs.nestjs.com/microservices/nats
- https://docs.nestjs.com/microservices/rabbitmq
- https://docs.nestjs.com/microservices/kafka
- https://docs.nestjs.com/microservices/grpc
- https://docs.nestjs.com/microservices/custom-transport
-->
