/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Humidor } from '../models/Humidor';
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
}
