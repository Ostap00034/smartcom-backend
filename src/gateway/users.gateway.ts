import {
	MessageBody,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(4201, {
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class UsersGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connect', socket => {
			console.log(socket.id)
			console.log('Подключились 1')
		})
	}

	@SubscribeMessage('updateProfile')
	udpateProfile() {
		console.log('ПИВО')
		this.server.sockets.emit('updateProfile')
	}

	handleDisconnect(client: Socket) {
		console.log('Отключились 1')
	}
}
