import { Order } from '../models';

export default class OrderRepository {
    private database;

    constructor(database) {
        this.database = database;
    }

    async getAll(): Promise<Order[]> {
        let orders: Order[] = await this.database.findAll();
        return orders;
    }

    async getByUserId(userId: number): Promise<Order[]> {
        let orders: Order[] = await this.database.findAll({
            where: {
                user_id: userId
            }
        });

        return orders;
    }

    async getByOrderId(orderId: number): Promise<Order> {
        let order: Order = await this.database.findOne({
            where: {
                order_id: orderId
            }
        });

        return order;
    }

    async getNew(): Promise<Order[]> {
        const new_orders: Order[] = await this.database.findAll({
            where: {
                status: 'new'
            },
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return new_orders;
    }

    async getProcessed(): Promise<Order[]> {
        const processed_orders: Order[] = await this.database.findAll({
            where: {
                status: 'processed'
            },
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return processed_orders;
    }

    async getCompleted(): Promise<Order[]> {
        const completed_orders: Order[] = await this.database.findAll({
            where: {
                status: 'completed'
            },
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return completed_orders;
    }

    async getRejected(): Promise<Order[]> {
        const rejected_orders: Order[] = await this.database.findAll({
            where: {
                status: 'rejected'
            },
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return rejected_orders;
    }

    async getTotalPaid(): Promise<number> {
        const orders = await this.getCompleted();
        let total_paid = 0;

        orders.forEach(order => {
            total_paid += order.amount;
        });

        return total_paid;
    }

    async add(order: Order): Promise<Order> {
        let newOrder: Order = await this.database.build(order).save();
        return newOrder;
    }
}