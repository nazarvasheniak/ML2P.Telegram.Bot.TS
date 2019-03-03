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

            /* /DEV */
        
            return false;
        });
    }
}

const main = new Main(http.createServer(app.getApplication()));