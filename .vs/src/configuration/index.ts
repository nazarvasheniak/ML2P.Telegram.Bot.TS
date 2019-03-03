import { Language } from '../models';

const config = {
    connectionString: 'mysql://root:Ivan230691@localhost:3306/referal',
    sequelizeOptions: {
        define: {
            charset: 'utf8',
            dialectOptions: {
                collate: 'utf8mb4_unicode_ci'
            }
        } 
    },
    port: 3000,
    defaultLanguage: Language.RU,
    ethereumOptions: {
        apiKey: 'C6BMIVNT8WC47C2V7GAZY4PJPIG7GRPKVS'
    }
};

export default config;