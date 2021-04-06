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
    // in the future when adding a new language, add a switch case for each enum value, and the default should be english
    return this.getEnglish();
  }

  abstract getEnglish(): ComponentLang;
}
