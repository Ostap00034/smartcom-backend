import { UpdateObjectDto } from './../object/dto/update-object.dto'
import {
	MessageBody,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ObjectDto } from 'src/object/dto/object.dto'

@WebSocketGateway(4201, {
	cors: {
		origin: ['https://smartcomygk.online'],
		credentials: true,
		transports: ['websocket', 'polling'],
	},
})
export class ObjectsGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connect', socket => {
			console.log(socket.id)
			console.log('Подключились')
		})
	}

	@SubscribeMessage('create')
	sendCreateObject(dto: ObjectDto) {
		console.log(dto)
		this.server.sockets.emit('create', dto)
	}

	@SubscribeMessage('update')
	sendUpdatedObject(dto: UpdateObjectDto) {
		this.server.sockets.emit('update', dto)
	}

	handleDisconnect(client: Socket) {
		console.log('Отключилис')
	}
}
