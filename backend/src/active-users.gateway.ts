import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IUserActivityService } from './auth/user-activity.interface';
import { Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ActiveUsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers = new Set<string>();

  constructor(
    @Inject('IUserActivityService')
    private readonly userActivityService: IUserActivityService,
  ) {}

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
    this.userActivityService.updateLastActivity(parseInt(userId));
  }

  emitActiveUsersCount() {
    this.server.emit('usersUpdate', this.activeUsers.size);
  }
}
