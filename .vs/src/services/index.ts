import config from '../configuration';

import Repositories from '../repositories';

import UserService from './user.service';
import WalletService from './wallet.service';
import TaskService from './task.service';
import OrderService from './order.service';

import { EthereumService } from './ethereum.service';

export default class Services {
    private repositories: Repositories;

    public userService: UserService;
    public walletService: WalletService;
    public taskService: TaskService;
    public orderService: OrderService;
    public ethereumService: EthereumService;

    constructor(repositories: Repositories) {
        this.repositories = repositories;
        
        this.createServices();
    }

    private createServices() {
        this.userService = new UserService(this.repositories.userRepository);
        this.walletService = new WalletService(this.repositories.walletRepository);
        this.taskService = new TaskService(this.repositories.taskRepository);
        this.orderService = new OrderService(this.repositories.orderRepository);
        this.ethereumService = new EthereumService(config.ethereumOptions.apiKey);
    }
}