import {
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(4201, {
	cors: {
		origin: ['https://smartcomygk.online', 'https://smartcomygc.online'],
		credentials: true,
		transports: ['websocket', 'polling'],
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
		this.server.sockets.emit('updateProfile')
	}

	handleDisconnect(client: Socket) {
		console.log('Отключились 1')
	}
}
