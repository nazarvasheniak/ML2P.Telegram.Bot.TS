import * as TelegramBot from 'node-telegram-bot-api';

import { User, Wallet, Order, Task, Language, Stat } from '../../models';
import { Strings, StringsType } from '../../common/strings';

import Services from '../../services';

import config from './config';
import global from '../../configuration';
import app from '../../http/app';

interface Listeners {
    language: {
        start: RegExp;
        main: RegExp;
    };
    start: RegExp;
    referal: RegExp;
}


const services: Services = app.services;

let stat: Stat = {
    age: 0,
    users_count: 0,
    new_users: 0,
    generations_count: 0,
    completed_tasks: 0,
    total_paid: 0
};

const keyboards = {
    language: [ 
        [{ text: "Русский" }, { text: "English" }] 
    ]
};

const listeners: Listeners = {
    language: {
        start: /\Русский|English/,
        main: /\Русский|English/,
    },
    start: /\/start/,
    referal: /^[0-9]+$|^@.+$/
};

const bot: TelegramBot = new TelegramBot(config.token, config.options);
const stringService: Strings = new Strings();

let strings: StringsType = stringService[Language.RU];

/**
 * Update system stats
 */
async function updateStat() {

    /* Calculate project age presented in days */
    stat.age = Math.floor((new Date().getTime() - new Date(config.startDate).getTime()) / 8.64e7);

    /* Get users count from database */
    stat.users_count = await services.userService.getUsersCount();

    /* Get new users count from database */
    stat.new_users = await services.userService.getNewUsersCount();

    /* Get total paid MLT from database */
    stat.total_paid = await services.orderService.getTotalPaidAmount();
}

/**
 * Get user data from database
 * @param {number} [user_id]
 * @param {number} [chat_id]
 */
async function getUser(user_id?: number, chat_id?: number): Promise<User | boolean> {
    if(!user_id && !chat_id) return false;

    if(user_id) {
        const user = await services.userService.getUserById(user_id);
        if(!user) return false;

        return user;
    }

    if(chat_id) {
        const user = await services.userService.getUserByChatId(chat_id);
        if(!user) return false;

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
 * Moun static listeners
 * @param {User} user
 */
function staticListeners(user: User) {
    this.bot.on("callback_query", async(query: TelegramBot.CallbackQuery) => {
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
                    orderListMessage += `--------------------------\n`;
                    orderListMessage += `${strings.wallet.orders.amount} ${order.amount} MLT \n`;
                    orderListMessage += `${strings.wallet.orders.status} ${order.status}\n`;
                    orderListMessage += `${strings.wallet.orders.created} ${order.createdAt}`;

                    if(order.updatedAt != order.createdAt) {
                        orderListMessage += `${strings.wallet.orders.updated} ${order.updatedAt}`;
                    }

                    orderListMessage += `--------------------------\n\n`;
                });
            }

            await bot.sendMessage(user.chat_id, orderListMessage);
            return false;
        }
    });
}

/**
 * Mount main menu
 * @param {User} user
 */
async function mountMainMenu(user: User) {
    user = await getUser(user.user_id).catch(err => { return err });

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

/**
 * Start
 */
function start() {
    this.bot.onText(listeners.start, async(message) => {
        const user = await services.userService.getUserByChatId(message.chat.id);

        if(!user) {
            bot.onText(listeners.language.start, (msg, match) => {
                bot.removeTextListener(listeners.language.start);
                registerUser(message, match.input == "Русский" ? Language.RU : match.input == "English" ? Language.EN : Language.RU);
            });

            this.bot.sendMessage(message.chat.id, "Выберите Ваш язык / Choose your language", {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: keyboards.language,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });

            return false;
        }

        await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
        main(user);

        return true;
    });
}

/**
 * Remove main menu listeners
 */
function removeMainListeners() {
    Object.keys(strings.mainMenu.buttons).forEach(key => {
        bot.removeTextListener(strings.mainMenu.buttons[key].listener);
    });
}

/**
 * Set main menu listeners
 */
async function setMainListeners(user: User) {

    user = await getUser(user.user_id).catch(err => { return err });

    // Language listener
    bot.onText(strings.mainMenu.buttons.language.listener, (msg, match) => {
        bot.sendMessage(msg.chat.id, 'Выберите Ваш язык / Choose your language', {
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
        user = await getUser(user.user_id).catch(err => {return err});
        
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

        bot.once("callback_query", async(query: TelegramBot.CallbackQuery) => {
            if(query.data == "setEthWallet") {
                await bot.answerCallbackQuery(query.id, {
                    text: strings.wallet.typeEthWallet,
                    show_alert: true
                });

                bot.once("message", async(msg: TelegramBot.Message) => {
                    if(msg.message_id != (query.message.message_id + 1)) {
                        return false;
                    }

                    await services.walletService.setEthWallet(user.wallet.wallet_id, msg.text);
                    bot.sendMessage(user.chat_id, strings.wallet.ethWalletSuccess);
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
        });
    });

    // Earn listener
    bot.onText(strings.mainMenu.buttons.earn.listener, async(msg, match) => {
        user = await getUser(user.user_id).catch(err => {return err});

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
        user = await getUser(user.user_id).catch(err => {return err});

        let teamMessage = `"И один в поле воин, но командная работа творит чудеса!"\n\n`;
        teamMessage += `Вы лично пригласили 0 человек\n`;
        teamMessage += `Благодаря этому у вас появилась команда последователей 0 человек с 1 го по 10 е поколение\n`;
        teamMessage += `Всего в вашей структуре 0 человек.\n\n`;
        teamMessage += `По системе "БАЛАНС" в вашей организации слева 0 человек, справа 0 человек.\n\n`;
        teamMessage += `Ваша реферальная ссылка - ${config.lgLink}=${user.user_id}\n`;
        teamMessage += `Отправьте ее своим друзьям, родственникам, знакомым, а так же разместите в своих социальных сетях и восхититесь силой "сарафанного радио".`;
        
        bot.sendMessage(user.chat_id, teamMessage);
    });

    // Invest listener
    bot.onText(strings.mainMenu.buttons.invest.listener, (msg, match) => {
        // invest template
        bot.sendMessage(user.chat_id, "Invest empty template");
    });

    // Stat listener
    bot.onText(strings.mainMenu.buttons.stat.listener, async(msg, match) => {
        user = await getUser(user.user_id).catch(err => {return err});

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
    this.bot.onText(strings.mainMenu.buttons.info.listener, (msg, match) => {
        // info template
        this.bot.sendMessage(user.chat_id, "Info empty template");
    });

    // Chat listener
    this.bot.onText(strings.mainMenu.buttons.chat.listener, (msg, match) => {
        // chat template
        this.bot.sendMessage(user.chat_id, "Chat empty template");
    });
}

/**
 * Method to set listeners for change language from maion menu
 */
function setLanguageListeners(user: User) {
    bot.onText(listeners.language.main, async(msg, match) => {
        await changeLanguage(user, match.input == "Русский" ? Language.RU : match.input == "English" ? Language.EN : Language.RU);
    });
}

/**
 * Withdraw funds
 * @param {User} user
 * @param {TelegramBot.Message} ask
 */
async function widthdaw(user: User, ask: TelegramBot.Message) {
    user = await getUser(user.user_id).catch(err => { return err });

    bot.once('message', async(msg: TelegramBot.Message) => {
        if(msg.message_id != (ask.message_id + 1)) {
            return false;
        }

        let amount = parseInt(msg.text);

        if(!user.wallet.eth_wallet) {
            let newAskEth = await bot.sendMessage(user.chat_id, strings.wallet.widthdrawNoEth)
                .catch(err => {
                    return err;
                });

            widthdaw(user, newAskEth);
        } else {
            if(amount < 10) {
                let newAskMin = await bot.sendMessage(user.chat_id, strings.wallet.widthdrawAmountMin)
                    .catch(err => {
                        return err;
                    });

                widthdaw(user, newAskMin);
            } else {
                if(user.wallet.balance < amount) {
                    await bot.sendMessage(user.chat_id, strings.wallet.widthdrawWrongBalance)
                        .catch(err => {
                            return err;
                        });
                } else {
                    await services.walletService.updateBalance(user.wallet.wallet_id, (user.wallet.balance - amount));
                    await createOrder({
                        user_id: user.user_id,
                        amount: amount
                    });

                    bot.sendMessage(user.chat_id, strings.wallet.widthdrawSuccess);
                }
            }
        }
    });
}

/**
 * @description
 * @param {User} user
 */
async function main(user: User) {
    user = await getUser(user.user_id).catch(err => { return err });

    let strings = stringService[Language[user.language]];
    setLanguageListeners(user);
    bot.removeTextListener(listeners.start);
    setMainListeners(user);
    staticListeners(user);
    mountMainMenu(user);
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
 * @param {TelegramBot.Message} msg
 * @param {User} referal
 * @param {Language} language
 */
async function createUserRequest(msg: TelegramBot.Message, referal: User, language: Language) {
    let user = await services.userService.createUser({
        username: msg.chat.username ? msg.chat.username : undefined,
        chat_id: msg.chat.id,
        language: language,
        referal_id: referal.user_id,
        wallet: {
            balance: 0
        }
    });

    if(!user) return false;
    return user;
}

/**
 * Register user
 * @param {TelegramBot.Message} message
 * @param {Language} language
 */
async function registerUser(message: TelegramBot.Message, language: Language) {
    let referal_id = parseInt(message.text.split(' ')[1]);
    strings = stringService[Language[language]];
    
    /* If referal ID is NOT specefied in start link */
    if(!referal_id) {
        bot.sendMessage(message.chat.id, strings.typeReferalId);
        processReferal(async(referal) => {
            let user = await createUserRequest(message, referal, language).catch(err => { return err });
            await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
            await accrualFunds(user, 1, strings.welcomeAccrual);
            
            user = await getUser(user.user_id);
            main(user);
        });

        return true;
    } 
    
    /* If referal ID is specefied in start link */
    if(referal_id) {
        let referal = await services.userService.getUserById(referal_id);

        /* If referal is NOT found in database */
        if(!referal) {
            bot.sendMessage(message.chat.id, strings.referalNotFound);
            await processReferal(async(referal) => {
                let user = await createUserRequest(message, referal, language).catch(err => { return err });
                await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
                await accrualFunds(user, 1, strings.welcomeAccrual);

                user = await getUser(user.user_id);
                main(user);
            });

            return true;
        } 
        
        /* If referal is found in database */
        if(referal) {
            let user = await createUserRequest(message, referal, language).catch(err => { return err });
            await bot.sendMessage(user.chat_id, `${strings.welcomeReferalLink} ${config.lgLink}=${user.user_id}`);
            await accrualFunds(user, 1, strings.welcomeAccrual);

            user = await getUser(user.user_id);
            main(user);
            return true;
        }
    }
}

/**
 * Update user in database
 * @param {User} user
 */
async function updateUser(user: User) {
    let rows = await services.userService.updateUser(user);

    if(!rows.length) return false;

    let updatedUser = await getUser(user.user_id).catch(err => { return err });

    strings = stringService[Language[user.language]];
    removeMainListeners();
    setMainListeners(updatedUser);

    return true;
}

/* Update system stats */
updateStat();

/* Initialize start listener */
start();

export default bot;