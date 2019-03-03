import { User } from '../models';
import UserRepository from '../repositories/user.repository';

export default class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepository.getAll();
        return users;
    }

    async getUsersCount() {
        let users_count = await this.userRepository.getCount();
        return users_count;
    }

    async getNewUsersCount() {
        let users_count = await this.userRepository.getNewUsersCount();
        return users_count;
    }

    async getLastUser(): Promise<User> {
        let user = await this.userRepository.getLast();
        return user;
    }

    async getUser(user_param: any): Promise<User> {
        if(user_param.includes('@')) {
            let user = await this.userRepository.getByUsername(user_param.substr(1, user_param.length));
            return user;
        }

        let user = await this.userRepository.getById(parseInt(user_param));
        return user;
    }

    async getUserById(userId: number): Promise<User> {
        let user = await this.userRepository.getById(userId);
        return user;
    }

    async getUsersByReferalId(referalId: number): Promise<User[]> {
        const users = await this.userRepository.getByReferalId(referalId);
        return users;
    }

    async getUserByChatId(chatId: number): Promise<User> {
        let user = await this.userRepository.getByChatId(chatId);
        return user;
    }

    async getUserByUsername(username: string): Promise<User> {
        let user = await this.userRepository.getByUsername(username);
        return user;
    }

    async createUser(user: User): Promise<User> {
        let newUser = await this.userRepository.add(user);
        return newUser;
    }

    async updateUser(user: User): Promise<number[]> {
        let updatedUser: number[] = await this.userRepository.update(user);
        return updatedUser;
    }

    async createFirstUser(): Promise<User> {
        let firstUser = await this.userRepository.createFirst();
        return firstUser;
    }
}