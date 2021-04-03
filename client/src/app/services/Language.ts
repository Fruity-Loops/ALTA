export enum Language {
  ENGLISH
}

// tslint:disable-next-line:no-empty-interface
export interface ComponentLang {}

export abstract class LangFactory {
  systemLanguage: Language;

  protected constructor(language: Language) {
    this.systemLanguage = language;
  }

  getComponentLang(): ComponentLang {
    if (this.systemLanguage === Language.ENGLISH) {
      return this.getEnglish();
    } else {
      return this.getEnglish();
    }
  }

  abstract getEnglish(): ComponentLang;
}
