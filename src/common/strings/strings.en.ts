export default {
    welcomeReferalLink: "Welcome! Your referal link:\n",
    welcomeAccrual: "Your bonus 1 MLT",
    referalNotFound: "User not found, try again:",
    typeReferalId: "Please, type referal username (e.g. @mlppool) / ID (e.g. 35284), who invited you:",
    mainMenu: {
        header: 'Menu',
        buttons: {
            wallet: {
                text: 'My CryptoWallet',
                listener: /\My CryptoWallet/
            },
            earn: {
                text: 'Earn',
                listener: /\Earn/
            },
            info: {
                text: 'Information',
                listener: /\Information/
            },
            stat: {
                text: 'Statistics',
                listener: /\Statistics/
            },
            team: {
                text: 'Team',
                listener: /\Team/
            },
            chat: {
                text: 'Chat',
                listener: /\Chat/
            },
            language: {
                text: 'Language',
                listener: /\Language/
            },
            invest: {
                text: 'Invest',
                listener: /\Invest/
            }
        }
    },
    wallet: {
        balance: "Your balance:",
        ethWallet:  "Your Ethereum wallet:",
        ethWalletNotSpecified: "Not Specified",
        typeEthWallet: "Enter Your Ethereum wallet",
        ethWalletSuccess: "Ethereum wallet saved successfully",
        ethWalletNotValid: "Your Ethereum wallet is incorrect",
        widthdrawText: "For withdraw You need to have more than 10 MLT and set Ethereum wallet",
        widthdrawAmountText: "Specify amount to withdraw",
        widthdrawAmountMin: "Amount must be 10 MLT or more!",
        widthdrawNoEth: "Ethereum wallet not specified!",
        widthdrawWrongBalance: "Not enough MLT on Your balance!",
        widthdrawSuccess: "Widthdraw request created successfully!",
        tokenCase: "Token case:",
        buttons: {
            widthdraw: "Widthdraw",
            transfer: "Transfer",
            setEthWallet: "Set Ethereum wallet",
            orders: "Your withdrawal requests"
        },
        orders: {
            headText: "List of your withdrawal requests",
            loading: "Loading list...",
            emptyList: "Your withdrawal requests list is empty",
            order: "Order",
            amount: "Amount:",
            status: "Status:",
            created: "Created:",
            updated: "Updated:"
        }
    },
    earn: {
        emptyList: "Task list is empty at this moment",
        buttons: {
            execute: "Execute",
            check: "Check"
        }
    },
    stat: {
        headText: "Есть крылатое выражение: 'Существует три вида лжи: ложь, наглая ложь и статистика'\nsmile smile smile\nТем не менее ниши цифры имеют огромное значение! Социально экономическая организация людей нового порядка - ML2P действует:",
        days: "days",
        regUsers: "registered users",
        newUsersToday: "new users today",
        generations: "generations",
        tasks: "completed tasks",
        widthdrawal: "paid out MLT"
    }
}