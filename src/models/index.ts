/**
 * Enumerable Language types
 * @enum {number}
 */
export enum Language {
    RU = 0,
    EN = 1
}

export type ReferalSide = 'left' | 'right';

export interface User {
    /**
     * @description
     * @type {number}
     */
    user_id?: number;

    /**
     * @description
     * @type {number}
     */
    chat_id: number;

    /**
     * @description
     * @type {string}
     */
    username?: string;

    /**
     * @description
     * @type {Language}
     */
    language: Language;

    /**
     * @description
     * @type {number}
     */
    referal_id: number;

    /**
     * @description
     * @type {ReferalSide}
     */
    side: ReferalSide;

    /**
     * @description
     * @type {ReferalSide}
     */
    referal_side: ReferalSide;

    /**
     * @description
     * @type {Wallet}
     */
    wallet?: Wallet;

    /**
     * @description
     * @type {Order[]}
     */
    orders?: Order[];
}

export interface Wallet {
    /**
     * @description
     * @type {number}
     */
    wallet_id?: number;

    /**
     * @description
     * @type {number}
     */
    user_id?: number;

    /**
     * @description
     * @type {number}
     */
    balance: number;

    /**
     * @description
     * @type {string}
     */
    eth_wallet?: string;
}

export interface Task {
    /**
     * @description
     * @type {number}
     */
    task_id?: number;

    /**
     * @description
     * @type {string}
     */
    text: string;

    /**
     * @description
     * @type {string}
     */
    url: string;
    
    completed_by?: {
        users: [
            {
                user_id: number,
                completed: boolean
            }
        ]
    };
}

export type OrderStatus = 'new' | 'processed' | 'completed' | 'rejected';

export interface Order {
    /**
     * @description
     * @type {number}
     */
    order_id?: number;

    /**
     * @description
     * @type {number}
     */
    user_id: number;

    /**
     * @description
     * @type {number}
     */
    amount: number;

    /**
     * @description
     * @type {OrderStatus}
     */
    status?: OrderStatus;

    /**
     * @description
     * @type {Date}
     */
    createdAt?: Date;

    /**
     * @description
     * @type {Date}
     */
    updatedAt?: Date;
}

export interface Stat {
    /**
     * @description
     * @type {number}
     */
    age: number;

    /**
     * @description
     * @type {number}
     */
    users_count: number;

    /**
     * @description
     * @type {number}
     */
    new_users: number;

    /**
     * @description
     * @type {number}
     */
    generations_count: number;

    /**
     * @description
     * @type {number}
     */
    completed_tasks: number;

    /**
     * @description
     * @type {number}
     */
    total_paid: number;
}

export interface RequestOptions {
    /**
     * A domain or IP address of the server to issue the request to. Default: 'http://localhost'.
     * @type {string}
     */
    hostname: string;

    /**
     * A string specifying the HTTP request method. Default: 'GET'.
     * @type {string}
     */
    method?: string;

    /**
     * Request path. Should include query string if any. E.G. '/index.html?page=12'.
     * @type {string}
     */
    path?: string;

    /**
     * An object containing request headers.
     * @type {HttpHeaders}
     */
    headers?: HttpHeaders;
}

export class HttpRequestOptions implements RequestOptions {
    public hostname: string;
    public method: string = 'GET';
    public path: string = '/';
    public headers?: HttpHeaders;

    constructor(options: RequestOptions) {
        this.hostname = options.hostname;
        this.method = options.method;
        this.path = options.path;
        this.headers = options.headers;
    }
}

export interface HttpHeaders {
    [key: string]: any;
}

export namespace Ethereum {
    export interface BalanceResponse {
        /**
         * Response status: 1 - OK, 0 - Error
         * @type {string}
         */
        status: string;

        /**
         * Response message
         * @type {string}
         */
        message: string;

        /**
         * Request result data
         * @type {string}
         */
        result: string;
    }
}