export default {
    welcomeReferalLink: "Добро пожаловать, Ваша реферальная ссылка:\n",
    welcomeAccrual: "Вам начислен приветственный бонус 1 MLT",
    referalNotFound: "Пользователь не найден, попробуйте еще раз:",
    typeReferalId: "Введите никнейм (например: @mlppool) / ID (например: 35284) реферала, пригласившего Вас:",
    mainMenu: {
        header: 'Меню',
        buttons: {
            wallet: {
                text: 'Мой криптокошелёк',
                listener: /\Мой криптокошелёк/
            },
            earn: {
                text: 'Заработать',
                listener: /\Заработать/
            },
            info: {
                text: 'Информация',
                listener: /\Информация/
            },
            stat: {
                text: 'Статистика',
                listener: /\Статистика/
            },
            team: {
                text: 'Команда',
                listener: /\Команда/
            },
            chat: {
                text: 'Чат',
                listener: /\Чат/
            },
            language: {
                text: 'Язык',
                listener: /\Язык/
            },
            invest: {
                text: 'Инвестировать',
                listener: /\Инвестировать/
            }
        }
    },
    wallet: {
        balance: "Ваш баланс:",
        ethWallet: "Ваш кошелек Ethereum:",
        ethWalletNotSpecified: "Не указан",
        typeEthWallet: "Введите Ваш Ethereum кошелёк",
        ethWalletSuccess: "Ethereum кошелёк успешно сохранён",
        ethWalletNotValid: "Вы введил некорректный Ethereum кошелек",
        widthdrawText: "Для вывода Вам необходимо иметь на балансе минимум 10 MLT и указать ETH кошелек.",
        widthdrawAmountText: "Укажите сумму которую хотите вывести",
        widthdrawAmountMin: "Сумма должна быть от 10 MLT и выше!",
        widthdrawNoEth: "Не указан Ethereum кошелёк!",
        widthdrawWrongBalance: "На Вашем балансе недостаточно MLT!",
        widthdrawSuccess: "Заявка на вывод успешно создана!",
        tokenCase: "Портфель токенов:",
        buttons: {
            widthdraw: "Вывод",
            transfer: "Перевод",
            setEthWallet: "Указать Ethereum кошелёк",
            orders: "Ваши заявки на вывод"
        },
        orders: {
            headText: "Список Ваших заявок на вывод средств",
            loading: "Загрузка списка...",
            emptyList: "Список Ваших заявок на вывод пуст",
            order: "Заявка",
            amount: "Сумма:",
            status: "Статус:",
            created: "Создана:",
            updated: "Обновлена:"
        }
    },
    earn: {
        emptyList: "На данный момент нет новых заданий",
        buttons: {
            execute: "Выполнить",
            check: "Проверить выполнение"
        }
    },
    stat: {
        headText: "Есть крылатое выражение: 'Существует три вида лжи: ложь, наглая ложь и статистика.'\n\nТем не менее ниши цифры имеют огромное значение! Социально экономическая организация людей нового порядка - ML2P действует:",
        days: "дней",
        regUsers: "зарегистрированных пользователей",
        newUsersToday: "новых пользователей сегодня",
        generations: "сформировалось поколений",
        tasks: "выполнено заданий",
        widthdrawal: "выплачено MLT"
    }
}