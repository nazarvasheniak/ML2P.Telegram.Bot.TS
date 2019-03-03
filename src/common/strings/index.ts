import { StringsType } from './strings.type';
import ru from './strings.ru';
import en from './strings.en';

export * from './strings.type';

export class Strings {
    RU: StringsType;
    EN: StringsType;

    constructor(RU?: StringsType, EN?: StringsType) {
        this.RU = ru;
        this.EN = en;
    }
}