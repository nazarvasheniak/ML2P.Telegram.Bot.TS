import * as Sequelize from 'sequelize';

export class Entities {
    private entities?: { User, Wallet, Task, Order };

    constructor(entities?: { User, Wallet, Task, Order }) {
        this.entities = entities;
    }

    /**
     * @description
     * @static
     * @param {Sequelize.Sequelize} sequelize
     * @returns 
     * @memberof Entities
     */
    static create(sequelize: Sequelize.Sequelize) {
        const User = sequelize.define('user', {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: true
            },
            chat_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            language: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            referal_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            referal_side: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });

        const Wallet = sequelize.define('wallet', {
            wallet_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            balance: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            eth_wallet: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });

        const Task = sequelize.define('task', {
            task_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            text: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            completed_by: {
                type: Sequelize.JSON,
                allowNull: true
            }
        });

        const Order = sequelize.define('order', {
            order_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            amount: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'new'
            }
        });
        
        User.hasOne(Wallet, { foreignKey: 'user_id', foreignKeyConstraint: true });
        User.hasMany(Order, { foreignKey: 'user_id', foreignKeyConstraint: true });

        return {
            User,
            Wallet,
            Task,
            Order
        };
    }

    get user() {
        return this.entities.User;
    }

    get wallet() {
        return this.entities.Wallet;
    }

    get task() {
        return this.entities.Task;
    }

    get order() {
        return this.entities.Order;
    }
}