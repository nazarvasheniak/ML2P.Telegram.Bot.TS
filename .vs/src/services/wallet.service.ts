import { Wallet } from '../models';
import WalletRepository from '../repositories/wallet.repository';

export default class WalletService {
    private walletRepository: WalletRepository;

    constructor(walletRepository: WalletRepository) {
        this.walletRepository = walletRepository;
    }

    async getAllWallets(): Promise<Wallet[]> {
        let wallets = await this.walletRepository.getAll();
        return wallets;
    }

    async getLastWallet(): Promise<Wallet> {
        let wallet = await this.walletRepository.getLast();
        return wallet;
    }

    async getWalletByUserId(userId: number): Promise<Wallet> {
        let wallet = await this.walletRepository.getByUserId(userId);
        return wallet;
    }

    async createWallet(wallet: Wallet): Promise<Wallet> {
        let newWallet = await this.walletRepository.create(wallet);
        return newWallet;
    }

    async getBalance(walletId: number): Promise<number> {
        let balance = await this.walletRepository.getBalance(walletId);
        return balance;
    }

    async updateBalance(walletId: number, value: number) {
        await this.walletRepository.updateBalance(walletId, value);
    }

    async getEthWallet(walletId: number): Promise<string> {
        let ethWallet = await this.walletRepository.getEthWallet(walletId);
        return ethWallet;
    }

    async setEthWallet(walletId: number, ethWallet: string) {
        await this.walletRepository.setEthWallet(walletId, ethWallet);
    }

    async createFirstWallet(user_id: number): Promise<Wallet> {
        let firstWallet = await this.walletRepository.createFirst(user_id);
        return firstWallet;
    }
}