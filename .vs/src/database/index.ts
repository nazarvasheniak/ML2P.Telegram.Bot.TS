import * as Sequelize from 'sequelize';
import { Entities } from './entities';
import { User, Wallet, Order, Task } from '../models';

export class Database {
    private sequelize: Sequelize.Sequelize;
    private models: Entities;

    constructor(connectionString, sequelizeOptions) {
        this.sequelize = new Sequelize(connectionString, sequelizeOptions);
        this.init();
    }

    private init() {
        this.models = new Entities(Entities.create(this.sequelize));
        this.sync(false);
    }

    private sync(force: boolean) {
        return this.sequelize.sync({ force: force });
    }

    private close() {
        return this.sequelize.close();
    }

    public getModels(): Entities {
        return this.models;
    }
}