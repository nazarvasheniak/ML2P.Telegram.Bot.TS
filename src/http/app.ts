import * as express from 'express';
import * as bodyParser from 'body-parser';

import config from '../configuration';

import { Database } from '../database';
import Repositories from '../repositories';
import Services from '../services';
import { Strings } from '../common/strings';

import { OrderRoute, UserRoute } from './routes';

class App {
    private express = express();
    private config = config;

    private database: Database;
    private repositories: Repositories;

    public services: Services;

    constructor() {
        this.database = new Database(this.config.connectionString, this.config.sequelizeOptions);
        
        this.init();
    }

    private init() {
        this.repositories = new Repositories(this.database.getModels());
        this.services = new Services(this.repositories);

        this.setOptions();
        this.mountRoutes();
    }

    private setOptions(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: true
        }));
        
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    private mountRoutes(): void {
        const order = new OrderRoute(this.services.orderService);
        const user = new UserRoute(this.services.userService);

        const orderRoute = order.getRoutes();
        const userRoute = user.getRoutes();

        this.express.use('/orders', orderRoute);
        this.express.use('/users', userRoute);
    }

    public getApplication() {
        return this.express;
    }

    public getPort() {
        return this.config.port;
    }
}

export default new App();