/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHumidorRequest } from '../models/CreateHumidorRequest';
import type { Humidor } from '../models/Humidor';
import type { UpdateHumidorRequest } from '../models/UpdateHumidorRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HumidorsService {
    /**
     * Get all humidors
     * Retrieve a list of all humidors
     * @returns Humidor Successful response
     * @throws ApiError
     */
    public static getHumidors(): CancelablePromise<Array<Humidor>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/humidor',
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create a humidor
     * @param requestBody
     * @returns Humidor Created
     * @throws ApiError
     */
    public static createHumidor(
        requestBody: CreateHumidorRequest,
    ): CancelablePromise<Humidor> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/humidor',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update a humidor
     * @param id
     * @param requestBody
     * @returns Humidor Updated
     * @throws ApiError
     */
    public static updateHumidor(
        id: string,
        requestBody: UpdateHumidorRequest,
    ): CancelablePromise<Humidor> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/humidor/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                404: `Not found`,
                409: `Capacity validation error`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete a humidor
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteHumidor(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/humidor/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
}
