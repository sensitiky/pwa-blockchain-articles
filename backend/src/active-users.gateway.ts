import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from './auth/users/users.service';

@WebSocketGateway({ cors: true })
export class ActiveUsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers = new Set<string>();

  constructor(private readonly usersService: UsersService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.add(userId);
      this.updateUserActivity(userId);
      this.emitActiveUsersCount();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.delete(userId);
      this.emitActiveUsersCount();
    }
  }

  updateUserActivity(userId: string) {
    this.usersService.updateLastActivity(parseInt(userId));
  }

  emitActiveUsersCount() {
    this.server.emit('usersUpdate', this.activeUsers.size);
  }
}
