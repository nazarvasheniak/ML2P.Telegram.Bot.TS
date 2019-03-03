import { Wallet } from '../models';

export default class WalletRepository {
    private database;

    constructor(database) {
        this.database = database;
    }

    async getAll(): Promise<Wallet[]> {
        let wallets: Wallet[] = await this.database.findAll();
        return wallets;
    }

    async getLast(): Promise<Wallet> {
        let wallet: Wallet = await this.database.findOne({
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return wallet;
    }

    async getByUserId(userId: number): Promise<Wallet> {
        let wallet: Wallet = await this.database.findOne({
            where: {
                user_id: userId
            }
        });

        return wallet;
    }

    async getBalance(walletId: number): Promise<number> {
        let wallet: Wallet = await this.database.findOne({
            where: {
                wallet_id: walletId
            }
        });
        
        return wallet.balance;
    }

    async updateBalance(walletId: number, value: number) {
        await this.database.update({
            balance: value
        }, {
            where: {
                wallet_id: walletId
            }
        });
    }

    async getEthWallet(walletId: number): Promise<string> {
        let wallet: Wallet = await this.database.findOne({
            where: {
                wallet_id: walletId
            }
        });

        return wallet.eth_wallet;
    }

    async setEthWallet(walletId: number, ethWallet: string) {
        await this.database.update({
            eth_wallet: ethWallet
        }, {
            where: {
                wallet_id: walletId
            }
        });
    }

    async create(wallet: Wallet): Promise<Wallet> {
        let newWallet = await this.database.build(wallet).save();
        return newWallet;
    }

    async createFirst(user_id: number): Promise<Wallet> {
        let firstWallet: Wallet = await this.database.build({
            user_id: user_id,
            balance: 0
        });

        return firstWallet;
    }
}