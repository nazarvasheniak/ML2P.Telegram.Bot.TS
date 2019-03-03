import { Strings } from '../common/strings';
import { StringsType } from '../common/strings/strings.type';
import { Language } from '../models';

export default class StringsService {
    private strings: Strings;

    constructor(strings: Strings) {
        this.strings = strings;
    }

    public getStringsByLang(lang: Language): StringsType {
        console.log(Language[lang]);
        return this.strings[Language[lang]];
    }
}