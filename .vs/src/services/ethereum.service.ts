import { RxHR } from '@akanass/rx-http-request';
import { Ethereum } from '../models';

export class EthereumService {
    /**
     * Http module
     */
    private http = RxHR;

    /**
     * Ethereum API key
     * @type {string}
     */
    private api_key: string;

    /**
     * Ethereum API endpoint
     */
    private apiEndpoint: string = "https://api.etherscan.io/api";
    
    constructor(api_key: string) {
        this.api_key = api_key;
    }

    public getWallet(address: string) {
        return this.http.get(`${this.apiEndpoint}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.api_key}`);
    }
}