/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateHumidorRequest = {
    /**
     * Name of the humidor
     */
    name: string;
    /**
     * Description of the humidor
     */
    description?: string | null;
    /**
     * Maximum number of cigars the humidor can hold
     */
    maximum_capacity: number;
};

