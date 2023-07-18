import { UpdateObjectDto } from './../object/dto/update-object.dto'
import { OnModuleInit } from '@nestjs/common'
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

	// OnGatewayDisconnect() {
	// 	this.server.off('connect', socket => {
	// 		console.log(socket.id)
	// 		console.log('Отключились')
	// 	})
	// }

	@SubscribeMessage('create')
	sendCreateObject(dto: ObjectDto) {
		console.log(dto)
		this.server.sockets.emit('create', dto)
	}

	@SubscribeMessage('update')
	sendUpdatedObject(dto: UpdateObjectDto) {
		this.server.sockets.emit('update', dto)
	}

	// @SubscribeMessage('objects')
	// handleMessage(@MessageBody() dto: ObjectDto) {
	// 	console.log(dto)
	// 	this.server.sockets.emit('newObject', {
	// 		content: dto,
	// 	})
	// }

	handleDisconnect(client: Socket) {
		console.log('Отключилис')
	}
}
