import * as TelegramBot from 'node-telegram-bot-api';

import { User, Wallet, Order, Task, Language, Stat, ReferalSide } from '../../models';
import { Strings, StringsType } from '../../common/strings';

import Services from '../../services';

import config from './config';
import global from '../../configuration';
import app from '../../http/app';

/**
 * Bot listeners interface
 */
interface Listeners {
    language: {
        start: RegExp;
        main: RegExp;
    };
    start: RegExp;
    referal: RegExp;
}

const ml2p_chat = -1001386592466;

/**
 * Bot keyboards
 */
const keyboards = {
    language: [ 
        [{ text: "Русский" }, { text: "English" }] 
    ]
};

/**
 * Bot listeners
 */
const listeners: Listeners = {
    language: {
        start: /\Русский|English/,
        main: /\Русский|English/,
    },
    start: /\/start/,
    referal: /^[0-9]+$|^@.+$/
};

const bot: TelegramBot = new TelegramBot(config.token, config.options);
const services: Services = app.services;
const stringService: Strings = new Strings();

let strings: StringsType = stringService[Language.RU];

/**
 * Get system stats
 */
async function getStats(): Promise<Stat> {

    /* Calculate project age presented in days */
    let age = Math.floor((new Date().getTime() - new Date(config.startDate).getTime()) / 8.64e7);

    /* Get users count from database */
    let users_count = await services.userService.getUsersCount();

    /* Get new users count from database */
    let new_users = await services.userService.getNewUsersCount();

    /* Generations count */
    let generations_count = 0;

    /* Get completed tasks count from database */
    let completed_tasks = 0;

    /* Get total paid MLT from database */
    let total_paid = await services.orderService.getTotalPaidAmount();

    return {
        age: age,
        users_count: users_count,
        new_users: new_users,
        generations_count: generations_count,
        completed_tasks: completed_tasks,
        total_paid: total_paid
    };
}

/**
 * Get user data from database
 * @param {number} [user_id]
 * @param {number} [chat_id]
 */
async function getUser(user_id?: number, chat_id?: number): Promise<User> {
    if(!user_id && !chat_id) return;

    if(user_id) {
        const user = await services.userService.getUserById(user_id);
        return user;
    }

    if(chat_id) {
        const user = await services.userService.getUserByChatId(chat_id);
        return user;
    }
}

/**
 * Accrual funds on user MLT balance
 * @param {User} user
 * @param {number} value
 * @param {string} [notificationText]
 */
async function accrualFunds(user: User, value: number, notificationText?: string) {
    /* DEV */
    if(user.username == "nazarv") {
        await services.walletService.updateBalance(user.wallet.wallet_id, user.wallet.balance + 1046);
        bot.sendMessage(user.chat_id, "Начислено!");
        return false;
    }
    /* /DEV */

    await services.walletService.updateBalance(user.wallet.wallet_id, user.wallet.balance + value);

    if(notificationText) {
        bot.sendMessage(user.chat_id, notificationText);
    }
}

/**
 * Mount main menu
 * @param {User} user
 */
function mountMainMenu(user: User) {
    let strings = stringService[Language[user.language]];

    bot.sendMessage(user.chat_id, strings.mainMenu.header, {
        parse_mode: "Markdown",
        reply_markup: {
            keyboard: [
                [{ text: strings.mainMenu.buttons.language.text }, { text: strings.mainMenu.buttons.wallet.text }],
                [{ text: strings.mainMenu.buttons.earn.text }, { text: strings.mainMenu.buttons.team.text }, { text: strings.mainMenu.buttons.invest.text }],
                [{ text: strings.mainMenu.buttons.stat.text }, { text: strings.mainMenu.buttons.info.text }, { text: strings.mainMenu.buttons.chat.text }]
            ],
            resize_keyboard: true
        }
    });
}

/**
 * Change language
 * @param {User} user
 * @param {Language} language
 */
async function changeLanguage(user: User, language: Language) {
    if(language != user.language) {
        user.language = language;
        await updateUser(user);
    }

    removeMainListeners();
    setMainListeners(language);
    mountMainMenu(user);
}

/**
 * Create order
 * @param {Order} order
 * @returns 
 */
async function createOrder(order: Order) {
    let newOrder = await services.orderService.createOrder(order);
    return newOrder;
}

async function changeReferalSide(user: User, side: ReferalSide) {
    let data = user;
    data.referal_side = side;

    await updateUser(data);
}

function getUserReferalsStructure(userId: number, depth: number) {
    if(depth > 10) {
        return false;
    }

    // User referals
    return services.userService.getUsersByReferalId(userId).then(referals => {
        referals.map(referal => {
            getUserReferalsStructure(referal.user_id, (depth + 1));
        });

        console.log(referals);
    });
}

/**
 * Remove main menu listeners
 */
function removeMainListeners() {
    let strings_ru: StringsType = stringService[Language[Language.RU]];
    let strings_en: StringsType = stringService[Language[Language.EN]];

    Object.keys(strings_ru.mainMenu.buttons).forEach(key => {
        bot.removeTextListener(strings_ru.mainMenu.buttons[key].listener);
    });

    Object.keys(strings_en.mainMenu.buttons).forEach(key => {
        bot.removeTextListener(strings_en.mainMenu.buttons[key].listener);
    });
}

/**
 * Set main menu listeners
 */
async function setMainListeners(language: Language) {
    let strings: StringsType = stringService[Language[language]];
    
    // Language listener
    bot.onText(strings.mainMenu.buttons.language.listener, (msg, match) => {
        bot.sendMessage(msg.from.id, 'Выберите Ваш язык / Choose your language', {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: keyboards.language,
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });
    });

    // Wallet listener
    bot.onText(strings.mainMenu.buttons.wallet.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];

        let walletMessage = `${strings.wallet.balance} **${user.wallet.balance} MLT**\n\n`;
        walletMessage += `${strings.wallet.ethWallet} **${user.wallet.eth_wallet ? user.wallet.eth_wallet : strings.wallet.ethWalletNotSpecified}**\n\n`;
        walletMessage += `${strings.wallet.tokenCase}\n`;
        walletMessage += `**-- MLPP: 0** \n\n`;

        let walletKeyboard = [
            [{ text: strings.wallet.buttons.widthdraw, callback_data: "withdraw" }, { text: strings.wallet.buttons.transfer, callback_data: "transfer" }],
            [{ text: strings.wallet.buttons.orders, callback_data: "order_list" }]
        ];

        if(!user.wallet.eth_wallet) {
            walletKeyboard.push([{ text: strings.wallet.buttons.setEthWallet, callback_data: "setEthWallet" }]);
        }

        bot.sendMessage(user.chat_id, walletMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: walletKeyboard
            }
        });
    });

    // Earn listener
    bot.onText(strings.mainMenu.buttons.earn.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];
        let tasks = await services.taskService.getAllTasks();

        if(!tasks.length) {
            await bot.sendMessage(user.chat_id, strings.earn.emptyList);
        } else {
            tasks.forEach(task => {
                bot.sendMessage(user.chat_id, task.text, {
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: strings.earn.buttons.execute, url: task.url }, { text: strings.earn.buttons.check, callback_data: "checkTask_"+task.task_id }]
                        ]
                    } 
                });
            });
        }
    });

    // Team listener
    bot.onText(strings.mainMenu.buttons.team.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];
        let referals = await services.userService.getUsersByReferalId(user.user_id);

        let teamMessage = `"И один в поле воин, но командная работа творит чудеса!"\n\n`;
        teamMessage += `Вы лично пригласили ${referals.length} человек\n`;
        teamMessage += `Благодаря этому у вас появилась команда последователей 0 человек с 1 го по 10 е поколение\n`;
        teamMessage += `Всего в вашей структуре 0 человек.\n\n`;
        teamMessage += `Ваша реферальная ссылка - ${config.lgLink}=${user.user_id}\n`;
        teamMessage += `Отправьте ее своим друзьям, родственникам, знакомым, а так же разместите в своих социальных сетях и восхититесь силой "сарафанного радио".\n\n`;
        teamMessage += `По системе "БАЛАНС" в вашей организации слева 0 человек, справа 0 человек.\n\n`;
        teamMessage += `Выбирете организацию куда регистрировать следующих ваших приглашенных:`;

        let teamKeyboard = [
            [{ text: "Левая", callback_data: "referals_left" }, { text: "Правая", callback_data: "referals_right" }]
        ];
        
        bot.sendMessage(user.chat_id, teamMessage, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: teamKeyboard
            }
        });
    });

    // Invest listener
    bot.onText(strings.mainMenu.buttons.invest.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];

        // invest template
        bot.sendMessage(user.chat_id, "Invest empty template");
    });

    // Stat listener
    bot.onText(strings.mainMenu.buttons.stat.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        const stat = await getStats();

        let strings: StringsType = stringService[Language[user.language]];

        let statMessage = `${strings.stat.headText}\n\n`;
        statMessage += `${stat.age} ${strings.stat.days}\n`;
        statMessage += `${stat.users_count} ${strings.stat.regUsers}\n`;
        statMessage += `${stat.new_users} ${strings.stat.newUsersToday}\n`;
        statMessage += `${stat.generations_count} ${strings.stat.generations}\n`;
        statMessage += `${stat.completed_tasks} ${strings.stat.tasks}\n`;
        statMessage += `${stat.total_paid} ${strings.stat.widthdrawal}\n`;

        bot.sendMessage(user.chat_id, statMessage);
    });

    // Info listener
    bot.onText(strings.mainMenu.buttons.info.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];

        // info template
        bot.sendMessage(user.chat_id, "Info empty template");
    });

    // Chat listener
    bot.onText(strings.mainMenu.buttons.chat.listener, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        let strings: StringsType = stringService[Language[user.language]];

        bot.sendMessage(user.chat_id, "https://t.me/joinchat/CtnHjVKluNKYkkmyYj8XWQ");
    });
}

/**
 * Method to set listeners for change language from main menu
 */
function setLanguageListeners() {
    bot.onText(listeners.language.main, async(msg, match) => {
        const user = await getUser(undefined, msg.from.id);
        await changeLanguage(user, match.input == "Русский" ? Language.RU : match.input == "English" ? Language.EN : Language.RU);
    });
}

/**
 * Method to remove listeners for change language from main menu
 */
function removeLanguageListeners() {
    bot.removeTextListener(listeners.language.main);
}

/**
 * Withdraw funds
 * @param {User} user
 * @param {TelegramBot.Message} ask
 */
async function widthdaw(user: User, ask: TelegramBot.Message) {
    bot.once('message', async(msg: TelegramBot.Message) => {
        let amount = parseInt(msg.text);

        if(msg.message_id != (ask.message_id + 1)) {
            return false;
        }

        if(!user.wallet.eth_wallet) {
            bot.sendMessage(user.chat_id, strings.wallet.widthdrawNoEth);
            return false;
        }

        if(amount < 10) {
            bot.sendMessage(user.chat_id, strings.wallet.widthdrawAmountMin);
            return false;
        }

        if(user.wallet.balance < amount) {
            bot.sendMessage(user.chat_id, strings.wallet.widthdrawWrongBalance)
            return false;
        }

        let order: Order = {
            user_id: user.user_id,
            amount: amount
        };

        createOrder(order);
        await services.walletService.updateBalance(user.wallet.wallet_id, (user.wallet.balance - amount));

        bot.sendMessage(user.chat_id, strings.wallet.widthdrawSuccess);
    });
}

/**
 * Process referal data and send it to callback function
 * @param {Function} callback
 */
async function processReferal(callback: Function) {
    bot.onText(listeners.referal, async(msg, match) => {
        console.log(match);
        let referal = await services.userService.getUser(match.input);

        if(!referal) {
            bot.sendMessage(msg.chat.id, strings.referalNotFound);
        } else {
            callback(referal);
            bot.removeTextListener(listeners.referal);
        }
    });
}

/**
 * Request to create new user
 * @param {number} referal_id
 * @param {Language} language
 * @param {number} chat_id
 * @param {string} [username]
 * @returns {Promise<User>} User instance
 */
async function createUserRequest(referal_id: number, language: Language, chat_id: number, side: ReferalSide, username?: string): Promise<User> {
    const user = await services.userService.createUser({
        username: username ? username : undefined,
        chat_id: chat_id,
        language: language,
        referal_id: referal_id,
        side: side,
        referal_side: 'left',
        wallet: {
            balance: 0
        }
    });

    return user;
}

/**
 * Update user in database
 * @param {User} user
 */
async function updateUser(user: User) {
    let rows = await services.userService.updateUser(user);
    if(!rows.length) return false;
}

/**
 * Callback listeners
 */
bot.on("callback_query", async(query: TelegramBot.CallbackQuery) => {
    const user = await getUser(undefined, query.from.id);
    let strings: StringsType = stringService[Language[user.language]];

    if(query.data == "order_list") {
        let orderListMessage = ``;

        await bot.answerCallbackQuery(query.id, {
            text: strings.wallet.orders.loading
        });

        if(!user.orders.length) {
            orderListMessage += `${strings.wallet.orders.emptyList}`;
        } else {
            orderListMessage += `${strings.wallet.orders.headText}\n\n`;
            
            user.orders.forEach(order => {
                orderListMessage += `${strings.wallet.orders.order} #${order.order_id}\n`;
                orderListMessage += `--------------------------\n`;
                orderListMessage += `${strings.wallet.orders.amount} ${order.amount} MLT \n`;
                orderListMessage += `${strings.wallet.orders.status} ${order.status}\n`;
                orderListMessage += `${strings.wallet.orders.created} ${order.createdAt.getDay()}.${order.createdAt.getMonth()}.${order.createdAt.getFullYear()} ${order.createdAt.getHours()}:${order.createdAt.getMinutes()}\n`;

                if(order.status != 'new') {
                    orderListMessage += `${strings.wallet.orders.updated} ${order.updatedAt.getDay()}.${order.updatedAt.getMonth()}.${order.updatedAt.getFullYear()} ${order.updatedAt.getHours()}:${order.updatedAt.getMinutes()}\n`;
                }

                orderListMessage += `--------------------------\n\n`;
            });
        }

        await bot.sendMessage(user.chat_id, orderListMessage);

        return false;
    }
    
    if(query.data == "setEthWallet") {
        await bot.answerCallbackQuery(query.id, {
            text: strings.wallet.typeEthWallet,
            show_alert: true
        });

        bot.once("message", async(msg: TelegramBot.Message) => {
            if(msg.message_id != (query.message.message_id + 1)) {
                return false;
            }

            services.ethereumService.getWallet(msg.text)
                .subscribe(response => {
                    if(response.status == '1') {
                        services.walletService.setEthWallet(user.wallet.wallet_id, msg.text);
                        bot.sendMessage(user.chat_id, strings.wallet.ethWalletSuccess);
                    } else {
                        bot.sendMessage(user.chat_id, strings.wallet.ethWalletNotValid);
                    }
                }, error => {
                    console.log(error);
                }, () => {
                    console.log('complete');
                });
        });

        return false;
    }

    if(query.data == "withdraw") {
        await bot.answerCallbackQuery(query.id, {
            text: strings.wallet.widthdrawText,
            show_alert: true
        });

        let amountAsk = await bot.sendMessage(user.chat_id, strings.wallet.widthdrawAmountText)
            .catch(err => {
                return err;
            });

        widthdaw(user, amountAsk);

        return false;
    }

    if(query.data == "referal_left") {
        await bot.answerCallbackQuery(query.id, {
            text: "Запрос отправляется...",
            show_alert: true
        });
    }
});

/**
 * Start listener
 */
bot.onText(listeners.start, async(message, match) => {

    // Get user
    const user = await getUser(undefined, message.from.id);

    // User not registered yet
    if(!user) {

        // Get referal ID from link
        let referal_id = parseInt(message.text.split(' ')[1]);
        let language = Language.RU;

        // Send language keyboard
        bot.sendMessage(message.chat.id, "Выберите Ваш язык / Choose your language", {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: keyboards.language,
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });

        // Listen language choose
        bot.onText(listeners.language.start, async(message, match) => {

            // Remove language choose listener
            bot.removeTextListener(listeners.language.start);
            
            if(match.input == "Русский") {
                language = Language.RU;
            } else if(match.input == "English") {
                language = Language.EN;
            }

            let strings = stringService[Language[language]];

            // Referal is not found in link
            if(!referal_id) {
                
                // Send referal request to user
                bot.sendMessage(message.from.id, strings.typeReferalId);

                // Listen referal response from user
                processReferal(async(referal: User) => {
                    const user = await createUserRequest(referal.user_id, language, message.from.id, referal.referal_side, message.from.username ? message.from.username : undefined);
                    await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
                    await accrualFunds(user, 1, strings.welcomeAccrual);
                    
                    removeMainListeners();
                    setLanguageListeners();
                    setMainListeners(language);
                    mountMainMenu(user);
                });
            } else {
                let referal = await getUser(referal_id);
                
                if(!referal) {
                    // Send referal request to user
                    bot.sendMessage(message.chat.id, strings.referalNotFound);
                    
                    // Listen referal response from user
                    processReferal(async(referal: User) => {
                        const user = await createUserRequest(referal.user_id, language, message.from.id, referal.referal_side, message.from.username ? message.from.username : undefined);
                        await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
                        await accrualFunds(user, 1, strings.welcomeAccrual);
                        
                        removeMainListeners();
                        setLanguageListeners();
                        setMainListeners(language);
                        mountMainMenu(user);
                    });
                } else {
                    const user = await createUserRequest(referal.user_id, language, message.from.id, referal.referal_side, message.from.username ? message.from.username : undefined);
                    await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
                    await accrualFunds(user, 1, strings.welcomeAccrual);
                    
                    removeMainListeners();
                    setLanguageListeners();
                    setMainListeners(language);
                    mountMainMenu(user);
                }
            }
        });

        return false;
    }

    removeMainListeners();
    setLanguageListeners();
    setMainListeners(user.language);
    mountMainMenu(user);

    return true;
});

export default bot;