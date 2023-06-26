import { OnModuleInit } from '@nestjs/common'
import {
	MessageBody,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { ObjectDto } from 'src/object/dto/object.dto'
import { UpdateObjectDto } from 'src/object/dto/update-object.dto'

@WebSocketGateway(4201, {
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class ObjectsGateway {
	@WebSocketServer()
	server: Server

	// onModuleInit() {
	// 	this.server.on('connect', socket => {
	// 		console.log(socket.id)
	// 		console.log('Подключились')
	// 	})
	// }

	@SubscribeMessage('object')
	sendNewObject(dto: ObjectDto) {
		console.log(dto)
		this.server.sockets.emit('object', dto)
	}

	updateObject(dto: UpdateObjectDto) {
		console.log(dto)
		this.server.sockets.emit('object', dto)
	}

	// @SubscribeMessage('objects')
	// handleMessage(@MessageBody() dto: ObjectDto) {
	// 	console.log(dto)
	// 	this.server.sockets.emit('newObject', {
	// 		content: dto,
	// 	})
	// }

	// handleDisconnect(client: Socket) {
	// 	console.log('Disclfjksldi')
	// }
}
