import { Order } from '../models';
import OrderRepository from '../repositories/order.repository';

export default class OrderService {
    private orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    public async getAllOrders(): Promise<Order[]> {
        let orders: Order[] = await this.orderRepository.getAll();
        return orders;
    }

    async getOrdersByUserId(userId: number): Promise<Order[]> {
        let orders: Order[] = await this.orderRepository.getByUserId(userId);
        return orders;
    }

    async getOrder(orderId: number): Promise<Order> {
        let order: Order = await this.orderRepository.getByOrderId(orderId);
        return order;
    }

    async getTotalPaidAmount(): Promise<number> {
        let total_paid: number = await this.orderRepository.getTotalPaid();
        return total_paid;
    }

    async createOrder(order: Order): Promise<Order> {
        let newOrder: Order = await this.orderRepository.add(order);
        return newOrder;
    }
}