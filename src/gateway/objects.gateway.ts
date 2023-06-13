import { OnModuleInit } from '@nestjs/common'
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'

import { Server } from 'socket.io'

@WebSocketGateway(4201)
export class ObjectsGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connection', socket => {
			console.log(socket.id)
			console.log('Connected')
		})
		this.server.off('disconnect', () => {
			console.log('Disconnected')
		})
	}

	@SubscribeMessage('objects')
	handleMessage(@MessageBody() body) {
		this.server.emit('onMessage', {
			message: 'Beer',
			content: body,
		})
	}
}
