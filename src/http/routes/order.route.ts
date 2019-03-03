import * as express from 'express';
import OrderService from '../../services/order.service';

export class OrderRoute {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    public getRoutes() {
        const router = express.Router();

        router.get('/', async(req, res) => {
            const orders = await this.orderService.getAllOrders();
            res.send(orders);
        });
        
        return router;
    }
}