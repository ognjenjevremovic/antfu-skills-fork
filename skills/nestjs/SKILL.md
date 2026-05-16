---
name: nestjs
description: NestJS - progressive Node.js framework for building scalable server-side applications with TypeScript
metadata:
  author: Anthony Fu
  version: "2026.5.16"
  source: Generated from https://github.com/nestjs/nest, scripts located at https://github.com/antfu/skills
---

> The skill is based on NestJS v11.1.21, generated at 2026-05-16.

NestJS is a TypeScript framework for building scalable server-side applications. It uses decorators, dependency injection, and a modular architecture inspired by Angular. Supports both Express and Fastify HTTP adapters, microservices (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC, MQTT), and WebSockets (Socket.IO).

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Modules | Module system, @Global, DynamicModule, ConfigurableModuleBuilder | [core-modules](references/core-modules.md) |
| Dependency Injection | Provider types, scopes, ModuleRef, forwardRef | [core-di](references/core-di.md) |
| Routing | Controllers, route decorators, parameter decorators, versioning, SSE, file upload | [core-routing](references/core-routing.md) |
| Request Pipeline | Middleware, guards, interceptors, pipes, exception filters execution order | [core-pipeline](references/core-pipeline.md) |
| Exceptions | Built-in HTTP exceptions, custom exceptions, exception filters | [core-exceptions](references/core-exceptions.md) |
| Application | Bootstrap, NestFactory, lifecycle hooks, shutdown hooks, Fastify adapter | [core-application](references/core-application.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Validation | DTOs with class-validator, built-in pipes, custom pipes, serialization | [features-validation](references/features-validation.md) |

## Advanced

### Microservices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Microservices | Transports (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC), message patterns, client proxies | [microservices](references/microservices.md) |

### WebSockets

| Topic | Description | Reference |
|-------|-------------|-----------|
| WebSockets | Gateways, adapters, lifecycle hooks, rooms, broadcasting | [websockets](references/websockets.md) |

### Testing

| Topic | Description | Reference |
|-------|-------------|-----------|
| Testing | Testing module, mocking, override methods, e2e testing | [testing](references/testing.md) |

### Integrations

| Topic | Description | Reference |
|-------|-------------|-----------|
| Integrations | OpenAPI/Swagger, GraphQL, TypeORM, Prisma, caching, events, queues, scheduling | [integrations](references/integrations.md) |
