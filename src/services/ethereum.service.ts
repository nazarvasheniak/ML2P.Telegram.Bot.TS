import * as http from 'http';
import { Ethereum, RequestOptions } from '../models';
import { Observable, Subject } from 'rxjs';

export class EthereumService {
    /**
     * Http module
     */
    private http = http;

    /**
     * Ethereum API key
     * @type {string}
     */
    private api_key: string;

    /**
     * Ethereum API endpoint
     */
    private apiEndpoint: string = "http://api.etherscan.io";

    private responseSubject: Subject<Ethereum.BalanceResponse> = new Subject<Ethereum.BalanceResponse>();
    
    constructor(api_key: string) {
        this.api_key = api_key;
    }

    public getWallet(address: string): Observable<Ethereum.BalanceResponse> {
        const req = this.http.get(`${this.apiEndpoint}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.api_key}`, (res) => {
            res.on("data", (data) => {
                this.responseSubject.next(JSON.parse(data.toString()));
            })
        });

        return this.responseSubject.asObservable();
    }
}