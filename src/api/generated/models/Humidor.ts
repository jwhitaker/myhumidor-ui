/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Humidor = {
    /**
     * Unique identifier for the humidor
     */
    id: string;
    /**
     * Name of the humidor
     */
    name: string;
    /**
     * Description of the humidor
     */
    description?: string | null;
    /**
     * Maximum number of cigars allowed in the humidor
     */
    maximum_capacity: number;
    /**
     * Current number of cigars stored in the humidor
     */
    current_count: number;
};

