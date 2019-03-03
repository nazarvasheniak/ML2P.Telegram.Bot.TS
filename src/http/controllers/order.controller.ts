import OrderService from '../../services/order.service';

export class OrderController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    public async getAllOrders(req, res) {
        const orders = await this.orderService.getAllOrders();
        return orders;
    }
}