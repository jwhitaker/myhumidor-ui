/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cigar } from '../models/Cigar';
import type { CreateCigarRequest } from '../models/CreateCigarRequest';
import type { UpdateCigarRequest } from '../models/UpdateCigarRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CigarsService {
    /**
     * Get cigars in a humidor
     * @param humidorId
     * @returns Cigar Successful response
     * @throws ApiError
     */
    public static listHumidorCigars(
        humidorId: string,
    ): CancelablePromise<Array<Cigar>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/humidor/{humidorId}/cigars',
            path: {
                'humidorId': humidorId,
            },
            errors: {
                404: `Humidor not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Add a cigar with an explicit humidor assignment
     * @param humidorId
     * @param requestBody
     * @returns Cigar Created
     * @throws ApiError
     */
    public static createHumidorCigar(
        humidorId: string,
        requestBody: CreateCigarRequest,
    ): CancelablePromise<Cigar> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/humidor/{humidorId}/cigars',
            path: {
                'humidorId': humidorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Humidor not found or request humidor assignment mismatches path`,
                409: `Humidor capacity reached`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update a cigar and explicitly set its humidor assignment
     * @param humidorId
     * @param cigarId
     * @param requestBody
     * @returns Cigar Updated
     * @throws ApiError
     */
    public static updateHumidorCigar(
        humidorId: string,
        cigarId: string,
        requestBody: UpdateCigarRequest,
    ): CancelablePromise<Cigar> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/humidor/{humidorId}/cigars/{cigarId}',
            path: {
                'humidorId': humidorId,
                'cigarId': cigarId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Humidor or cigar not found`,
                409: `Humidor capacity reached`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Remove a cigar from a humidor
     * @param humidorId
     * @param cigarId
     * @returns void
     * @throws ApiError
     */
    public static deleteHumidorCigar(
        humidorId: string,
        cigarId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/humidor/{humidorId}/cigars/{cigarId}',
            path: {
                'humidorId': humidorId,
                'cigarId': cigarId,
            },
            errors: {
                404: `Humidor or cigar not found`,
                500: `Internal server error`,
            },
        });
    }
}
