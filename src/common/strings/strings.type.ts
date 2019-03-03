export class StringsType {
    welcomeReferalLink: string;
    welcomeAccrual: string;
    referalNotFound: string;
    typeReferalId: string;
    mainMenu: {
        header: string;
        buttons: {
            wallet: {
                text: string;
                listener: RegExp;
            };
            earn: {
                text: string;
                listener: RegExp;
            };
            info: {
                text: string;
                listener: RegExp;
            };
            stat: {
                text: string;
                listener: RegExp;
            };
            team: {
                text: string;
                listener: RegExp;
            };
            chat: {
                text: string;
                listener: RegExp;
            };
            language: {
                text: string;
                listener: RegExp;
            };
            invest: {
                text: string;
                listener: RegExp;
            };
        }
    };
    wallet: {
        balance: string;
        ethWallet: string;
        ethWalletNotSpecified: string;
        typeEthWallet: string;
        ethWalletSuccess: string;
        ethWalletNotValid: string;
        widthdrawText: string;
        widthdrawAmountText: string;
        widthdrawAmountMin: string;
        widthdrawNoEth: string;
        widthdrawWrongBalance: string;
        widthdrawSuccess: string;
        tokenCase: string;
        buttons: {
            widthdraw: string;
            transfer: string;
            setEthWallet: string;
            orders: string;
        };
        orders: {
            headText: string;
            loading: string;
            emptyList: string;
            order: string;
            amount: string;
            status: string;
            created: string;
            updated: string;
        }
    };
    earn: {
        emptyList: string;
        buttons: {
            execute: string;
            check: string;
        };
    };
    stat: {
        headText: string;
        days: string;
        regUsers: string;
        newUsersToday: string;
        generations: string;
        tasks: string;
        widthdrawal: string;
    }
}