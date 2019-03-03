import * as Sequelize from 'sequelize';
import { User, Wallet, Order, Task } from '../models';

export default class UserRepository {
    private database: { user: any, wallet: any, order: any };

    constructor(User, Wallet, Order) {
        this.database = { user: User, wallet: Wallet, order: Order };
    }

    async getAll(): Promise<User[]> {
        let users: User[] = await this.database.user.findAll({
            include: [
                { model: this.database.wallet },
                { model: this.database.order}
            ],
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return users;
    }

    async getCount() {
        let users_count = await this.database.user.count();
        return users_count;
    }

    async getNewUsersCount() {
        let users_count = await this.database.user.count({
            where: {
                createdAt: {
                    [Sequelize.Op.gte]: new Date().setHours(0, 0, 0, 0)
                }
            },
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return users_count;
    }

    async getLast(): Promise<User> {
        let user: User = await this.database.user.findOne({
            include: [
                { model: this.database.wallet },
                { model: this.database.order }
            ],
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return user;
    }

    async getById(userId: number): Promise<User> {
        let user: User = await this.database.user.findOne({
            include: [
                { model: this.database.wallet },
                { model: this.database.order }
            ],
            where: { user_id: userId }
        });

        return user;
    }

    async getByReferalId(referalId: number): Promise<User[]> {
        const users: User[] = await this.database.user.findAll({
            include: [
                { model: this.database.wallet },
                { model: this.database.order }
            ],
            where: { referal_id: referalId }
        });

        return users;
    }

    async getByChatId(chatId: number): Promise<User> {
        let user: User = await this.database.user.findOne({
            include: [
                { model: this.database.wallet },
                { model: this.database.order }
            ],
            where: { chat_id: chatId }
        });

        return user;
    }

    async getByUsername(user_name: string): Promise<User> {
        let user: User = await this.database.user.findOne({
            include: [
                { model: this.database.wallet },
                { model: this.database.order }
            ],
            where: { username: user_name }
        });

        return user;
    }

    async add(user: User): Promise<User> {
        let newUser: User = await this.database.user.build(user, {
            include: this.database.wallet
        }).save();

        return newUser;
    }

    async update(user: User): Promise<number[]> {
        let updatedUser: number[] = await this.database.user.update({
            username: user.username,
            language: user.language,
            referal_side: user.referal_side
        }, {
            where: {
                user_id: user.user_id
            }
        });

        return updatedUser;
    }

    async createFirst(): Promise<User> {
        let firstUser: User = await this.database.user.findOrCreate({
            where: {
                user_id: 1
            },
            include: [{
                model: this.database.wallet,
                where: {
                    wallet_id: 1
                }
            }],
            defaults: {
                user_id: 1,
                username: 'firstuser',
                chat_id: 1,
                language: 0,
                referal_id: 0,
                referal_side: 'left',
                wallet: {
                    wallet_id: 1,
                    balance: 0
                }
            }
        });

        return firstUser;
    }
}