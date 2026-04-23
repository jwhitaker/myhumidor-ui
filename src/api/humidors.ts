import { OpenAPI } from './generated/core/OpenAPI'
import { ApiError } from './generated/core/ApiError'
import { HumidorsService } from './generated/services/HumidorsService'
import type { CreateHumidorRequest, UpdateHumidorRequest } from './generated'

OpenAPI.BASE = import.meta.env.VITE_MYHUMIDOR_API_URL ?? 'http://localhost:8080'

export class HumidorApiError extends Error {
	readonly status?: number

	constructor(message: string, status?: number) {
		super(message)
		this.name = 'HumidorApiError'
		this.status = status
	}
}

const toHumidorApiError = (err: unknown): HumidorApiError => {
	if (err instanceof ApiError) {
		const message =
			typeof err.body?.message === 'string'
				? err.body.message
				: err.message || 'Request failed'
		return new HumidorApiError(message, err.status)
	}
	if (err instanceof Error) {
		return new HumidorApiError(err.message)
	}
	return new HumidorApiError('Request failed')
}

export const getHumidors = () => HumidorsService.getHumidors()

export const createHumidor = async (body: CreateHumidorRequest) => {
	try {
		return await HumidorsService.createHumidor(body)
	} catch (err) {
		throw toHumidorApiError(err)
	}
}

export const updateHumidor = async (id: string, body: UpdateHumidorRequest) => {
	try {
		return await HumidorsService.updateHumidor(id, body)
	} catch (err) {
		throw toHumidorApiError(err)
	}
}

export const deleteHumidor = async (id: string) => {
	try {
		await HumidorsService.deleteHumidor(id)
	} catch (err) {
		throw toHumidorApiError(err)
	}
}
