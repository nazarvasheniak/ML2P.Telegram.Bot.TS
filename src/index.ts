import * as http from 'http';
import * as https from 'https';

import app from './http/app';
import Telegram from './modules/telegram';

import { User, Wallet, Order, Task, Language } from './models';

class Main {
    public telegram;
    public server: http.Server;

    constructor(server: http.Server) {
        this.server = server;

        this.init();
    }

    private async init() {
        this.server.listen(app.getPort(), async(err) => {
            if(err) {
                console.log(err);
                return err;
            }
        
            console.log(`server is listening on ${app.getPort()}`);
            this.telegram = Telegram;

            /* DEV */

            let first_user = await app.services.userService.createFirstUser().catch(err => { return err; });
            
            let users = await app.services.userService.getAllUsers().catch(err => { return err; });
            console.log(users);

            /* for(let i = 2; i < 6; i++) {
                await app.services.userService.createUser({
                    user_id: i,
                    chat_id: i,
                    language: Language.RU,
                    referal_id: 1,
                    wallet: {
                        wallet_id: i,
                        balance: 0
                    }
                });
            }

            for(let i = 6; i < 15; i++) {
                await app.services.userService.createUser({
                    user_id: i,
                    chat_id: i,
                    language: Language.RU,
                    referal_id: 2,
                    wallet: {
                        wallet_id: i,
                        balance: 0
                    }
                });
            }

            for(let i = 15; i < 21; i++) {
                await app.services.userService.createUser({
                    user_id: i,
                    chat_id: i,
                    language: Language.RU,
                    referal_id: 3,
                    wallet: {
                        wallet_id: i,
                        balance: 0
                    }
                });
            }

            for(let i = 21; i < 27; i++) {
                await app.services.userService.createUser({
                    user_id: i,
                    chat_id: i,
                    language: Language.RU,
                    referal_id: 4,
                    wallet: {
                        wallet_id: i,
                        balance: 0
                    }
                });
            } */

            /* /DEV */
        
            return false;
        });
    }
}

const main = new Main(http.createServer(app.getApplication()));