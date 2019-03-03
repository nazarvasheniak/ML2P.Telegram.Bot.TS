import * as express from 'express';
import * as bodyParser from 'body-parser';

import config from '../configuration';

import { Database } from '../database';
import Repositories from '../repositories';
import Services from '../services';
import { Strings } from '../common/strings';

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
    }

    private mountRoutes(): void {
        const router = express.Router();

        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });

        this.express.use('/', router);
    }

    public getApplication() {
        return this.express;
    }

    public getPort() {
        return this.config.port;
    }
}

export default new App();