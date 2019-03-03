import UserRepository from './user.repository';
import WalletRepository from './wallet.repository';
import TaskRepository from './task.repository';
import OrderRepository from './order.repository';

export default class Repositories {
    private models;

    public userRepository: UserRepository;
    public walletRepository: WalletRepository;
    public taskRepository: TaskRepository;
    public orderRepository: OrderRepository;

    constructor(models) {
        this.models = models;

        this.createRepositories();
    }

    private createRepositories() {
        this.userRepository = new UserRepository(this.models.user, this.models.wallet, this.models.order);
        this.walletRepository = new WalletRepository(this.models.wallet);
        this.taskRepository = new TaskRepository(this.models.task);
        this.orderRepository = new OrderRepository(this.models.order);
    }
}