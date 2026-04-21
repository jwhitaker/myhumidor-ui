import { OpenAPI } from './generated/core/OpenAPI'
import { HumidorsService } from './generated/services/HumidorsService'

OpenAPI.BASE = import.meta.env.VITE_MYHUMIDOR_API_URL ?? 'http://localhost:8080'

export const getHumidors = () => HumidorsService.getHumidors()
