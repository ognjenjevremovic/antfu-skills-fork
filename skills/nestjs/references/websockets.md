---
name: websockets
description: WebSocket gateways, adapters, lifecycle hooks, rooms
---

# WebSockets

## Gateway Setup

```typescript
@WebSocketGateway({ namespace: 'events', cors: { origin: '*' } })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // called after server initialized
  }

  handleConnection(client: Socket) {
    // called on client connect
  }

  handleDisconnect(client: Socket) {
    // called on client disconnect
  }
}
```

## Message Handlers

```typescript
@SubscribeMessage('message')
handleMessage(@MessageBody() data: string): string {
  return data; // synchronous return sends response back
}

// With pipes
@SubscribeMessage('create')
handleCreate(@MessageBody(new ValidationPipe()) data: CreateDto) {}

// Access full payload
@SubscribeMessage('event')
handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  client.join('room');
  this.server.to('room').emit('message', data);
}

// Manual acknowledgment
@SubscribeMessage('event')
handleEvent(@MessageBody() data: any, @Ack() ack: Function) {
  ack('received');
  // continue processing...
}
```

## Rooms & Broadcasting

```typescript
// Join a room
client.join('room-name');

// Leave a room
client.leave('room-name');

// Broadcast to room
this.server.to('room-name').emit('event', payload);

// Broadcast to all except sender
client.broadcast.emit('event', payload);

// Broadcast to all connected clients
this.server.emit('event', payload);
```

## WebSocket Adapter

NestJS abstracts WebSocket implementations. Default is Socket.IO.

Custom adapter extends `AbstractWsAdapter`:
```typescript
import { AbstractWsAdapter } from '@nestjs/websockets';

class WsAdapter extends AbstractWsAdapter {
  create(port: number, options?: any): any { /* return server */ }
  bindClientConnect(server: any, callback: Function) { /* bind connection handler */ }
  bindMessageHandlers(client: any, handlers: any, transform: any) { /* bind message routing */ }
  close(server: any) { /* close server */ }
}
```

Register adapter:
```typescript
const app = await NestFactory.create(AppModule);
app.useWebSocketAdapter(new WsAdapter(app));
```

## Exception Handling

```typescript
throw new WsException('Invalid request');

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    client.emit('exception', { message: exception.message });
  }
}
```

## Gateway Lifecycle Hooks

| Hook | Method | Description |
|------|--------|-------------|
| `OnGatewayInit` | `afterInit(server)` | After server created |
| `OnGatewayConnection` | `handleConnection(client)` | Client connects |
| `OnGatewayDisconnect` | `handleDisconnect(client)` | Client disconnects |

<!--
Source references:
- https://docs.nestjs.com/websockets/gateways
- https://docs.nestjs.com/websockets/adapter
-->
