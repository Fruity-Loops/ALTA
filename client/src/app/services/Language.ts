export enum Language {
  ENGLISH
}

// nothing fancy here since there is no planned functionality for switching languages
export class CurrentSystemLanguage {
  // tslint:disable-next-line:variable-name
  private static _language = Language.ENGLISH;

  public static get language(): Language {
    return this._language;
  }
}

// tslint:disable-next-line:no-empty-interface
export interface ComponentLang {}

export abstract class LangFactory {

  getComponentLang(): ComponentLang {
    if (CurrentSystemLanguage.language === Language.ENGLISH) {
      return this.getEnglish();
    } else {
      return this.getEnglish();
    }
  }

  abstract getEnglish(): ComponentLang;
}
